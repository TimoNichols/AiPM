@echo off
title Orbit Agent Studio
cd /d "%~dp0"
echo Orbit Agent Studio is running at http://localhost:4173
echo Keep this window open while using the app.
echo.
python -m http.server 4173
pause

