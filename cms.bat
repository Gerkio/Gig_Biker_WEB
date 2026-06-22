@echo off
title Big Biker - CMS (Sanity Studio)
cd /d "%~dp0"

echo ============================================
echo   BIG BIKER - CMS (Sanity Studio)
echo ============================================
echo.

where npm >nul 2>nul
if errorlevel 1 goto NONODE

if not exist "node_modules\" goto INSTALL
goto CHECKBUILD

:INSTALL
echo [1/3] Instalando dependencias (solo la primera vez)...
call npm install
if errorlevel 1 goto ERRINSTALL
echo.

:CHECKBUILD
if exist ".next\BUILD_ID" goto RUN
echo [2/3] Optimizando la web (solo la primera vez, ~1 min)...
echo.
call npm run build
if errorlevel 1 goto ERRBUILD
echo.

:RUN
echo [3/3] Iniciando servidor en http://localhost:3000/studio
echo.
echo Se abrira el CMS en el navegador. Inicia sesion con tu cuenta de Sanity.
echo Para detener: cierra esta ventana o pulsa Ctrl+C
echo.
start "" cmd /c "timeout /t 6 /nobreak >nul & start http://localhost:3000/studio"
call npm run start
goto END

:NONODE
echo ERROR: No se encontro Node.js / npm en el PATH.
echo Instala Node.js desde https://nodejs.org y vuelve a intentar.
goto END

:ERRINSTALL
echo ERROR durante la instalacion de dependencias. Revisa el mensaje de arriba.
goto END

:ERRBUILD
echo ERROR al optimizar la web. Revisa el mensaje de arriba.
goto END

:END
echo.
pause
