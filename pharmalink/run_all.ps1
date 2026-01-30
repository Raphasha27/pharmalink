# PharmaLink - Start Everything
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "PHARMALINK STARTUP ECOSYSTEM INITIALIZING" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Start Backend API
Write-Host "[1/3] Starting Backend API on http://localhost:3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# 2. Wait for Backend
Start-Sleep -Seconds 3

# 3. Start IoT Simulator
Write-Host "[2/3] Starting IoT Bag Simulator (Monitoring PL-8822)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node scripts/iot_simulator.js"

# 4. Launch Dashboard
Write-Host "[3/3] Launching Master Control Dashboard..." -ForegroundColor Green
Start-Process "app.html"

Write-Host "`nAll systems active! Check the terminal windows for live logs.`n" -ForegroundColor Green
