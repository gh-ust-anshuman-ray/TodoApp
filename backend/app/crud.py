# app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from .auth import hash_password, verify_password

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = hash_password(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_pw  # ✅ Should be hashed
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        print("❌ User not found")
        return False
    if not verify_password(password, user.password):
        print("❌ Password mismatch")
        return False
    return user

