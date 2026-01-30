# PharmaLink Initialization Script

# Install Backend Dependencies
Write-Host "Installing Backend dependencies..." -ForegroundColor Cyan
Set-Location -Path "backend"
npm install
Set-Location -Path ".."

Write-Host "PharmaLink project initialized successfully!" -ForegroundColor Green
Write-Host "Run 'cd backend; npm run dev' to start the API server." -ForegroundColor Yellow
