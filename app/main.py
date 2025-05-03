from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

from app.routers import rooms, users, files, auth
from app.database import init_db

app = FastAPI(title="Cloudany")

# CORS настройки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение статических файлов
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app", "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Подключение роутеров
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(rooms.router)
app.include_router(files.router)

@app.on_event("startup")
async def startup():
    init_db()

@app.get("/")
async def root():
    return {"message": "Welcome to Cloudany API"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 