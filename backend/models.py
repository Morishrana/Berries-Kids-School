from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from database import engine   # 👈 YE ADD KAR

Base = declarative_base()

class Student(Base):

    __tablename__ = "students"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    father = Column(String)
    email = Column(String)
    student_class = Column(String)


# 👇 YE ADD KAR (table create ke liye)
Base.metadata.create_all(bind=engine)