@echo off
echo Running npm install...
call "C:\Program Files\nodejs\npm.cmd" install
if errorlevel 1 exit /b 1

echo Running npm run build...
call "C:\Program Files\nodejs\npm.cmd" run build
if errorlevel 1 exit /b 1

echo Build completed successfully.
exit /b 0
