@echo off
echo ===================================================
echo   SST Tunisie - Auto-Sync to GitHub
echo ===================================================
echo.
echo Staging all changes...
git add .
echo.
echo Committing changes...
git commit -m "auto: update project files (%date% %time%)"
echo.
echo Pushing to GitHub (main branch)...
git push origin main
echo.
echo ===================================================
echo   Sync Complete!
echo ===================================================
pause
