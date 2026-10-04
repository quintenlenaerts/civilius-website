@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py tools\serve.py
) else (
  python tools\serve.py
)
pause
