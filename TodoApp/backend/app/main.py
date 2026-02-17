from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import user, tasks  # ✅ include `tasks`
from .database import Base, engine

app = FastAPI()

Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ✅ Root endpoint
@app.get("/")
def read_root():
    return {"message": "TODO API is running"}

# ✅ Register both routers
app.include_router(user.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")  # ✅ Task routes enabled

