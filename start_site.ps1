cd C:\Users\Administrator\.gemini\antigravity\scratch\harmonie-Retrouvailles\harmonie-Retrouvailles-main\backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm install; npm start"

cd C:\Users\Administrator\.gemini\antigravity\scratch\harmonie-Retrouvailles\harmonie-Retrouvailles-main\frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm install; npm run dev"
