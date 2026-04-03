from fastapi import FastAPI
from pydantic import BaseModel
from database import SessionLocal
import models

# 👇 NEW IMPORT
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 👇 CORS ADD KAR (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Admission(BaseModel):
    name: str
    father: str
    email: str
    student_class: str


@app.get("/")
def home():
    return {"message": "Berries Kids School API Running"}


@app.post("/admission")
def admission(data: Admission):
    db = SessionLocal()

    new_student = models.Student(
        name=data.name,
        father=data.father,
        email=data.email,
        student_class=data.student_class
    )

    db.add(new_student)
    db.commit()
    db.close()

    return {"message": "Admission Saved in Database ✅"}


@app.get("/students")
def get_students():
    db = SessionLocal()
    students = db.query(models.Student).all()
    db.close()
    return students