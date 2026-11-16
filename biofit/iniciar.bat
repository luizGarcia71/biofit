@echo off
cd /d "%~dp0"
echo Gym CRM Biofit em http://localhost:8080
echo Deixe esta janela aberta enquanto usar o sistema.
start "" cmd /c "timeout /t 2 >nul & start http://localhost:8080"
where python >nul 2>nul
if %errorlevel%==0 ( python -m http.server 8080 & goto :eof )
where py >nul 2>nul
if %errorlevel%==0 ( py -m http.server 8080 & goto :eof )
echo Python nao encontrado. Instale em python.org ou abra o index.html com dois cliques.
pause
