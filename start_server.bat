@echo off
cd /d "F:\Double X\sprouthr"
start /B cmd /c "npx next dev --webpack -p 3001 > next-dev.log 2>&1"
echo Waiting for dev server to start...
timeout /t 20 /nobreak >nul
echo Dev server should be running
