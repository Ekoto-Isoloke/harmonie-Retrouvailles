@echo off
git pull origin main --rebase
git push origin HEAD:main
exit /b 0
