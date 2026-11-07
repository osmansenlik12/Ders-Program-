@echo off
title Ders Programi - EXE Builder
cd /d "%~dp0"
chcp 65001 >nul

echo ============================================
echo   Ders Programi - Windows EXE Builder
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [HATA] Node.js kurulu degil!
    echo.
    echo Lutfen su adresten LTS surumu indirip kurun:
    echo   https://nodejs.org/
    echo.
    echo Kurduktan sonra bu dosyayi tekrar calistirin.
    echo.
    pause
    exit /b 1
)

echo [1/3] Node.js bulundu:
node --version
echo.

if not exist "node_modules" (
    echo [2/3] Bagimliliklar indiriliyor... (ilk seferde 3-5 dakika)
    call npm install
    if errorlevel 1 (
        echo [HATA] npm install basarisiz!
        pause
        exit /b 1
    )
) else (
    echo [2/3] Bagimliliklar zaten kurulu, atlandi.
)
echo.

echo [3/3] EXE olusturuluyor... (5-10 dakika, sabirli olun)
call npx electron-builder --win
if errorlevel 1 (
    echo [HATA] Build basarisiz!
    pause
    exit /b 1
)

echo.
echo ============================================
echo   TAMAMLANDI!
echo ============================================
echo.
echo Cikti dosyasi:
echo   %cd%\dist\DersProgrami-1.0.0.exe
echo.
if exist "%cd%\dist" start "" "%cd%\dist"
pause