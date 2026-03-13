from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, sessions, agents, providers, settings, history
from app.core.config import get_settings
from app.core.database import init_db

settings_obj = get_settings()

app = FastAPI(title=settings_obj.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings_obj.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")
app.include_router(agents.router, prefix="/api")
app.include_router(providers.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(history.router, prefix="/api")


@app.on_event("startup")
def on_startup() -> None:
    init_db()
