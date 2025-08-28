# PowerShell script to setup and run the development server
# Navigate to the script's directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $scriptPath
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green

# Check if package.json exists
if (Test-Path "package.json") {
    Write-Host "Found package.json" -ForegroundColor Green
    
    # Check if node_modules exists
    if (!(Test-Path "node_modules")) {
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        & npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Dependencies installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "Failed to install dependencies. Exit code: $LASTEXITCODE" -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 1
        }
    } else {
        Write-Host "Dependencies already installed" -ForegroundColor Green
    }
    
    # Start the development server
    Write-Host "Starting development server..." -ForegroundColor Yellow
    & npm run dev
} else {
    Write-Host "package.json not found in current directory" -ForegroundColor Red
    Write-Host "Current files:" -ForegroundColor Yellow
    Get-ChildItem | Select-Object Name
    Read-Host "Press Enter to exit"
}