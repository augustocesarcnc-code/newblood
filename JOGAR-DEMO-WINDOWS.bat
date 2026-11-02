@echo off
setlocal
cd /d "%~dp0"
rem Prefer the portable Node 24 folder already used by this project on Windows.
for /d %%D in ("%~dp0node-v24*-win-x64") do if exist "%%D\node.exe" set "PATH=%%D;%PATH%"
where node >nul 2>nul
if errorlevel 1 (
 echo Instale Node 24 LTS ou coloque a pasta portatil node-v24...-win-x64 dentro de Eclipse.
 pause
 exit /b 1
)
node jogar.mjs --demo
pause
