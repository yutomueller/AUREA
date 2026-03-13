@echo off
start cmd /k "cd /d %~dp0backend && python -m venv .venv && .venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000"
start cmd /k "cd /d %~dp0frontend && npm install && npm run dev"
start http://localhost:5173
