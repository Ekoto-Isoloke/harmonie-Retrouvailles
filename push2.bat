@echo off
git rebase --abort
git fetch origin main
git reset --hard origin/main
git checkout -b deploy-fix
echo { > vercel.json
echo   "version": 2, >> vercel.json
echo   "builds": [ >> vercel.json
echo     { >> vercel.json
echo       "src": "frontend/package.json", >> vercel.json
echo       "use": "@vercel/static-build", >> vercel.json
echo       "config": { >> vercel.json
echo         "distDir": "dist" >> vercel.json
echo       } >> vercel.json
echo     }, >> vercel.json
echo     { >> vercel.json
echo       "src": "backend/src/**/*.js", >> vercel.json
echo       "use": "@vercel/node" >> vercel.json
echo     } >> vercel.json
echo   ], >> vercel.json
echo   "routes": [ >> vercel.json
echo     { "src": "/api/(.*)", "dest": "/backend/src/$1" }, >> vercel.json
echo     { "src": "/(.*)", "dest": "/$1" } >> vercel.json
echo   ] >> vercel.json
echo } >> vercel.json
git add vercel.json
git commit -m "Fix Vercel configuration"
git push origin deploy-fix:main -f
exit /b 0
