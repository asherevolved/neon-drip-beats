@echo off
echo Navigating to project directory...
pushd "%~dp0"
echo Current directory: %CD%
echo Installing dependencies...
npm install
if %errorlevel% equ 0 (
    echo Dependencies installed successfully!
    echo Starting development server...
    npm run dev
) else (
    echo Failed to install dependencies.
    pause
)