@echo off
title SPROUTHR + API
echo ========================================
echo  Starting SPROUTHR + Job API...
echo ========================================
echo.

:: Start API server (in its own window)
echo [1/2] Starting Job Scraper API on :3001...
start "SPROUTHR API" cmd /c "cd /d "F:\Double X\API" && node src\server.js"

:: Small pause to let API boot
timeout /t 2 /nobreak >nul

:: Start Next.js dev server (in its own window)
echo [2/2] Starting SPROUTHR on :3000...
start "SPROUTHR Web" cmd /c "cd /d "F:\Double X\sprouthr" && npx next dev --webpack"

echo.
echo ========================================
echo  Both servers started!
echo  Web:  http://localhost:3000
echo  API:  http://localhost:3001
echo ========================================
echo.
echo  Close the windows to stop the servers.
pause
