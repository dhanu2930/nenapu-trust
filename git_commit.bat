@echo off
if exist .git\index.lock del /f /q .git\index.lock
"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "Update Jnataparva writer photo and spotlight for Karthik Bhat"
