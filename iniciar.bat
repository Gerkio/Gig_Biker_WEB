@echo off
title Big Biker - Servidor de demostracion
cd /d "%~dp0"

echo ============================================
echo   BIG BIKER - Maqueta funcional
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
echo [2/3] Optimizando la web para maxima velocidad...
echo       (solo la primera vez, puede tardar ~1 minuto)
echo.
call npm run build
if errorlevel 1 goto ERRBUILD
echo.

:RUN
echo [3/3] Iniciando servidor RAPIDO en http://localhost:3000
echo.
echo El navegador se abrira automaticamente.
echo Para detener: cierra esta ventana o pulsa Ctrl+C
echo.
start "" cmd /c "timeout /t 6 /nobreak >nul & start http://localhost:3000"
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
