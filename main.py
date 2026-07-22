from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

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
    allow_origins=["*"],  # Allows all origins (update for production)
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
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True

class ResearchRequest(BaseModel):
    topic: Optional[str] = None
    session_id: Optional[int] = None
    prompt: Optional[str] = None

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

# --- Protected Research Endpoint ---
@app.post("/api/research")
def conduct_research(
    request: ResearchRequest, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not request.topic and not request.session_id:
        raise HTTPException(status_code=400, detail="Topic or session_id is required")
    
    try:
        if request.session_id:
            # Refine existing session
            session = db.query(models.ResearchSession).filter(models.ResearchSession.id == request.session_id, models.ResearchSession.user_id == current_user.id).first()
            if not session:
                raise HTTPException(status_code=404, detail="Session not found")
            
            # get history
            messages = db.query(models.Message).filter(models.Message.session_id == session.id).order_by(models.Message.created_at.asc()).all()
            history_str = "\n".join([f"{m.role}: {m.content}" for m in messages])
            last_report = next((m.content for m in reversed(messages) if m.message_type == 'report'), "")
            
            try:
                state = refine_research_pipeline(last_report, history_str, request.prompt)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to generate updated report: {str(e)}")
            
            # Save new messages
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
            # New session
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
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- History Endpoints ---
@app.get("/api/sessions", response_model=List[SessionResponse])
def get_sessions(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    sessions = db.query(models.ResearchSession).filter(models.ResearchSession.user_id == current_user.id).order_by(models.ResearchSession.created_at.desc()).all()
    res = []
    for s in sessions:
        res.append({
            "id": s.id,
            "topic": s.topic,
            "created_at": str(s.created_at),
            "messages": []
        })
    return res

@app.get("/api/sessions/{session_id}", response_model=SessionResponse)
def get_session(session_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    session = db.query(models.ResearchSession).filter(models.ResearchSession.id == session_id, models.ResearchSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    messages = db.query(models.Message).filter(models.Message.session_id == session_id).order_by(models.Message.created_at.asc()).all()
    
    msgs = [{"id": m.id, "role": m.role, "content": m.content, "message_type": m.message_type, "created_at": str(m.created_at)} for m in messages]
    
    return {
        "id": session.id,
        "topic": session.topic,
        "created_at": str(session.created_at),
        "messages": msgs
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
