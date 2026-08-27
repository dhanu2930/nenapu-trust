@echo off
if exist .git\index.lock del /f /q .git\index.lock
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "Update leadership to Secretary's Vision with multiline accolades"
"C:\Program Files\Git\cmd\git.exe" push origin master
echo.
echo ===================================================
echo Changes committed and pushed to GitHub successfully!
echo Vercel deployment will update in a few moments.
echo ===================================================
pause
