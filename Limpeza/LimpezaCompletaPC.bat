@echo off
color 03
Title Limpeza Completa do PC

:: Verifica se está sendo executado como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ==================================================
    echo [ERRO]: Este script precisa ser executado como administrador.
    echo Por favor, clique nele com o botao direito e selecione
    echo "Executar como administrador".
    echo ==================================================
    pause
    exit /b
)

set "windows=%windir%"
set "systemdrive=%systemdrive%"
set "userprofile=%userprofile%"
set "temp=%temp%"
set "history=%userprofile%\Local Settings\History"
set "cookies=%userprofile%\Cookies"
set "recent=%userprofile%\Recent"
set "printers=%systemroot%\system32\spool\printers"

del /s /f /q "%windows%\temp\*.*" 2>nul
del /s /f /q "%windows%\Prefetch\*.exe" 2>nul
del /s /f /q "%windows%\Prefetch\*.dll" 2>nul
del /s /f /q "%windows%\Prefetch\*.pf" 2>nul
del /s /f /q "%windows%\system32\dllcache\*.*" 2>nul
del /s /f /q "%systemdrive%\Temp\*.*" 2>nul
del /s /f /q "%temp%\*.*" 2>nul
del /s /f /q "%history%\*.*" 2>nul
del /s /f /q "%userprofile%\Local Settings\Temporary Internet Files\*.*" 2>nul
del /s /f /q "%userprofile%\Local Settings\Temp\*.*" 2>nul
del /s /f /q "%recent%\*.*" 2>nul
del /s /f /q "%cookies%\*.*" 2>nul

echo Limpando registros de eventos...
FOR /F "tokens=*" %%G in ('wevtutil.exe el') DO (call :do_clear "%%G")

:do_clear
echo Limpando %1...
wevtutil.exe cl %1

echo Limpeza completa!
pause >nul

exit 

:noAdmin
echo ==================================================
echo [ERRO]: Execute este script como administrador.
echo ==================================================
pause
