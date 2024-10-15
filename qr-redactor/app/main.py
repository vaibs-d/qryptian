from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.model import SensitiveDataIdentifier
from app.redactor import redact_text
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    redacted_text = Column(String)
    scan_date = Column(DateTime, default=datetime.utcnow)
    total_sensitive_items = Column(Integer)

class SensitiveItem(Base):
    __tablename__ = "sensitive_items"

    id = Column(Integer, primary_key=True, index=True)
    scan_result_id = Column(Integer)
    type = Column(String)
    text = Column(String)
    start = Column(Integer)
    end = Column(Integer)
    score = Column(Float)

Base.metadata.create_all(bind=engine)

app = FastAPI()
identifier = SensitiveDataIdentifier()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class TextInput(BaseModel):
    text: str

class SensitiveDataItem(BaseModel):
    type: str
    text: str
    start: int
    end: int
    score: float

class RedactedOutput(BaseModel):
    redacted_text: str
    sensitive_data: List[SensitiveDataItem]

class ScanResultOutput(BaseModel):
    id: int
    text: str
    redacted_text: str
    scan_date: datetime
    total_sensitive_items: int
    sensitive_items: List[SensitiveDataItem]

# Routes
@app.post("/redact", response_model=RedactedOutput)
async def redact_sensitive_data(input: TextInput, db: SessionLocal = Depends(get_db)):
    sensitive_data = identifier.identify_sensitive_data(input.text)
    redacted_text = redact_text(input.text, sensitive_data)
    
    # Store the scan result
    db_scan_result = ScanResult(
        text=input.text,
        redacted_text=redacted_text,
        total_sensitive_items=len(sensitive_data)
    )
    db.add(db_scan_result)
    db.commit()
    db.refresh(db_scan_result)

    # Store sensitive items
    for item in sensitive_data:
        db_sensitive_item = SensitiveItem(
            scan_result_id=db_scan_result.id,
            type=item["type"],
            text=item["text"],
            start=item["start"],
            end=item["end"],
            score=item["score"]
        )
        db.add(db_sensitive_item)
    db.commit()

    return RedactedOutput(redacted_text=redacted_text, sensitive_data=sensitive_data)

@app.get("/scan_results", response_model=List[ScanResultOutput])
async def get_scan_results(skip: int = 0, limit: int = 10, db: SessionLocal = Depends(get_db)):
    results = db.query(ScanResult).offset(skip).limit(limit).all()
    output = []
    for result in results:
        sensitive_items = db.query(SensitiveItem).filter(SensitiveItem.scan_result_id == result.id).all()
        output.append(ScanResultOutput(
            id=result.id,
            text=result.text,
            redacted_text=result.redacted_text,
            scan_date=result.scan_date,
            total_sensitive_items=result.total_sensitive_items,
            sensitive_items=[SensitiveDataItem(**item.__dict__) for item in sensitive_items]
        ))
    return output

@app.get("/statistics")
async def get_statistics(db: SessionLocal = Depends(get_db)):
    total_scans = db.query(ScanResult).count()
    total_sensitive_items = db.query(ScanResult).with_entities(func.sum(ScanResult.total_sensitive_items)).scalar()
    return {
        "total_scans": total_scans,
        "total_sensitive_items": total_sensitive_items or 0
    }