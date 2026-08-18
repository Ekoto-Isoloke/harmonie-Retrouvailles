@echo off
echo Demarrage du backend...
cd /d C:\Users\Administrator\.gemini\antigravity\scratch\harmonie-Retrouvailles-v2\repo\backend
start "Backend Harmonie" cmd /k "npm install && npm start"

echo Demarrage du frontend...
cd /d C:\Users\Administrator\.gemini\antigravity\scratch\harmonie-Retrouvailles-v2\repo\frontend
start "Frontend Harmonie" cmd /k "npm install && npm run dev"

echo Les deux serveurs sont en cours de demarrage...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
pause
