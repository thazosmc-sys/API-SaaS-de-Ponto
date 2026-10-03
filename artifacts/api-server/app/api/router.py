from fastapi import APIRouter

from app.api.routes import auth, time_records

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(time_records.router, prefix="/time-records", tags=["time-records"])