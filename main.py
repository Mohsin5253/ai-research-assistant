from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import hashlib
import secrets
import string

import models
from database import engine, get_db
from auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from pipeline import run_research_pipeline, refine_research_pipeline

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="NexusAI Research API")

# Setup CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    is_active: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    message_type: Optional[str] = None
    created_at: str

    class Config:
        from_attributes = True

class SessionResponse(BaseModel):
    id: int
    topic: str
    created_at: str
    is_public: bool = False
    public_slug: Optional[str] = None
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True

class ResearchRequest(BaseModel):
    topic: Optional[str] = None
    session_id: Optional[int] = None
    prompt: Optional[str] = None

class ApiKeyCreate(BaseModel):
    name: str

class ApiKeyResponse(BaseModel):
    id: int
    name: str
    key_prefix: str
    created_at: str

# --- Helper: Resolve user from Bearer token OR X-API-Key header ---
def get_user_from_api_key(x_api_key: str, db: Session) -> models.User:
    key_hash = hashlib.sha256(x_api_key.encode()).hexdigest()
    api_key_record = db.query(models.UserApiKey).filter(models.UserApiKey.key_hash == key_hash).first()
    if not api_key_record:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    user = db.query(models.User).filter(models.User.id == api_key_record.user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    return user

def get_current_user_flexible(
    authorization: Optional[str] = Header(default=None),
    x_api_key: Optional[str] = Header(default=None),
    db: Session = Depends(get_db)
) -> models.User:
    """Accept either Bearer JWT token or X-API-Key header."""
    if x_api_key:
        return get_user_from_api_key(x_api_key, db)
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
        # Reuse existing auth logic
        from auth import SECRET_KEY, ALGORITHM
        from jose import JWTError, jwt
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            if not email:
                raise HTTPException(status_code=401, detail="Invalid token")
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    raise HTTPException(status_code=401, detail="Not authenticated")

# --- Auth Endpoints ---
@app.post("/api/auth/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer", "user": new_user}

@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer", "user": user}

@app.get("/api/auth/me", response_model=UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- Public Share Endpoint (no auth required) ---
@app.get("/api/public/{slug}")
def get_public_session(slug: str, db: Session = Depends(get_db)):
    session = db.query(models.ResearchSession).filter(
        models.ResearchSession.public_slug == slug,
        models.ResearchSession.is_public == True
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Shared report not found")
    messages = db.query(models.Message).filter(
        models.Message.session_id == session.id
    ).order_by(models.Message.created_at.asc()).all()
    last_report = next((m.content for m in reversed(messages) if m.message_type == 'report'), "")
    last_critic = next((m.content for m in reversed(messages) if m.message_type == 'critic'), "")
    return {
        "topic": session.topic,
        "report": last_report,
        "feedback": last_critic,
        "created_at": str(session.created_at)
    }

# --- Protected Research Endpoint (Bearer OR X-API-Key) ---
@app.post("/api/research")
def conduct_research(
    request: ResearchRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user_flexible)
):
    if not request.topic and not request.session_id:
        raise HTTPException(status_code=400, detail="Topic or session_id is required")

    try:
        if request.session_id:
            session = db.query(models.ResearchSession).filter(
                models.ResearchSession.id == request.session_id,
                models.ResearchSession.user_id == current_user.id
            ).first()
            if not session:
                raise HTTPException(status_code=404, detail="Session not found")

            messages = db.query(models.Message).filter(
                models.Message.session_id == session.id
            ).order_by(models.Message.created_at.asc()).all()
            history_str = "\n".join([f"{m.role}: {m.content}" for m in messages])
            last_report = next((m.content for m in reversed(messages) if m.message_type == 'report'), "")

            try:
                state = refine_research_pipeline(last_report, history_str, request.prompt)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to generate updated report: {str(e)}")

            user_msg = models.Message(session_id=session.id, role="user", content=request.prompt, message_type="prompt")
            report_msg = models.Message(session_id=session.id, role="assistant", content=state.get("report", ""), message_type="report")
            critic_msg = models.Message(session_id=session.id, role="assistant", content=state.get("feedback", ""), message_type="critic")

            db.add(user_msg)
            db.add(report_msg)
            db.add(critic_msg)
            db.commit()

            return {
                "success": True,
                "session_id": session.id,
                "topic": session.topic,
                "report": state.get("report", ""),
                "feedback": state.get("feedback", "")
            }
        else:
            try:
                state = run_research_pipeline(request.topic)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to generate research report: {str(e)}")

            new_session = models.ResearchSession(user_id=current_user.id, topic=request.topic)
            db.add(new_session)
            db.commit()
            db.refresh(new_session)

            report_msg = models.Message(session_id=new_session.id, role="assistant", content=state.get("report", ""), message_type="report")
            critic_msg = models.Message(session_id=new_session.id, role="assistant", content=state.get("feedback", ""), message_type="critic")
            db.add(report_msg)
            db.add(critic_msg)
            db.commit()

            return {
                "success": True,
                "session_id": new_session.id,
                "topic": request.topic,
                "report": state.get("report", ""),
                "feedback": state.get("feedback", "")
            }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- History Endpoints ---
@app.get("/api/sessions", response_model=List[SessionResponse])
def get_sessions(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    sessions = db.query(models.ResearchSession).filter(
        models.ResearchSession.user_id == current_user.id
    ).order_by(models.ResearchSession.created_at.desc()).all()
    res = []
    for s in sessions:
        res.append({
            "id": s.id,
            "topic": s.topic,
            "created_at": str(s.created_at),
            "is_public": s.is_public or False,
            "public_slug": s.public_slug,
            "messages": []
        })
    return res

@app.get("/api/sessions/{session_id}", response_model=SessionResponse)
def get_session(session_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    session = db.query(models.ResearchSession).filter(
        models.ResearchSession.id == session_id,
        models.ResearchSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    messages = db.query(models.Message).filter(
        models.Message.session_id == session_id
    ).order_by(models.Message.created_at.asc()).all()

    msgs = [{"id": m.id, "role": m.role, "content": m.content, "message_type": m.message_type, "created_at": str(m.created_at)} for m in messages]

    return {
        "id": session.id,
        "topic": session.topic,
        "created_at": str(session.created_at),
        "is_public": session.is_public or False,
        "public_slug": session.public_slug,
        "messages": msgs
    }

@app.delete("/api/sessions/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    session = db.query(models.ResearchSession).filter(
        models.ResearchSession.id == session_id,
        models.ResearchSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.query(models.Message).filter(models.Message.session_id == session_id).delete()
    db.delete(session)
    db.commit()
    return {"success": True, "message": "Session deleted"}

@app.post("/api/sessions/{session_id}/share")
def share_session(session_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    session = db.query(models.ResearchSession).filter(
        models.ResearchSession.id == session_id,
        models.ResearchSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if not session.public_slug:
        slug = secrets.token_urlsafe(10)
        session.public_slug = slug

    session.is_public = True
    db.commit()
    db.refresh(session)
    return {"success": True, "public_slug": session.public_slug, "is_public": True}

@app.post("/api/sessions/{session_id}/unshare")
def unshare_session(session_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    session = db.query(models.ResearchSession).filter(
        models.ResearchSession.id == session_id,
        models.ResearchSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    session.is_public = False
    db.commit()
    return {"success": True, "is_public": False}

# --- API Keys Endpoints ---
@app.get("/api/keys", response_model=List[ApiKeyResponse])
def list_api_keys(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    keys = db.query(models.UserApiKey).filter(
        models.UserApiKey.user_id == current_user.id
    ).order_by(models.UserApiKey.created_at.desc()).all()
    return [{"id": k.id, "name": k.name, "key_prefix": k.key_prefix, "created_at": str(k.created_at)} for k in keys]

@app.post("/api/keys")
def create_api_key(payload: ApiKeyCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    alphabet = string.ascii_letters + string.digits
    raw_key_body = ''.join(secrets.choice(alphabet) for _ in range(40))
    raw_key = f"nex_{raw_key_body}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    key_prefix = raw_key[:12] + "..."

    new_key = models.UserApiKey(
        user_id=current_user.id,
        name=payload.name,
        key_hash=key_hash,
        key_prefix=key_prefix
    )
    db.add(new_key)
    db.commit()
    db.refresh(new_key)

    return {
        "id": new_key.id,
        "name": new_key.name,
        "key_prefix": new_key.key_prefix,
        "created_at": str(new_key.created_at),
        "full_key": raw_key  # Returned ONCE only — not stored in plaintext
    }

@app.delete("/api/keys/{key_id}")
def revoke_api_key(key_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    key = db.query(models.UserApiKey).filter(
        models.UserApiKey.id == key_id,
        models.UserApiKey.user_id == current_user.id
    ).first()
    if not key:
        raise HTTPException(status_code=404, detail="API key not found")
    db.delete(key)
    db.commit()
    return {"success": True, "message": "API key revoked"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
