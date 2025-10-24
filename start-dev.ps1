# ChemCraft Development Server Starter
# This script ensures we are always in the correct directory

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "Starting ChemCraft Development Server..." -ForegroundColor Green
Write-Host "Project Directory: $((Get-Location).Path)" -ForegroundColor Yellow

# Check if package.json exists
if (Test-Path "package.json") {
    Write-Host "package.json found" -ForegroundColor Green
    npm run dev
} else {
    Write-Host "ERROR: package.json not found in current directory!" -ForegroundColor Red
    Write-Host "Current directory: $((Get-Location).Path)" -ForegroundColor Red
    exit 1
}