@echo off
cd /d "%~dp0"
echo Starting ChemCraft Development Server...
echo Project Directory: %CD%
npm run dev
pause