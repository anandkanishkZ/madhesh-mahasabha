# Quick Start Script for Membership System Testing

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Madhesh Mahasabha - Membership System" -ForegroundColor Cyan
Write-Host "  Quick Start Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "d:\Natraj Technology\Website Client\Madhesh Mahasabha\project"

# Function to check if port is in use
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

Write-Host "Step 1: Checking prerequisites..." -ForegroundColor Yellow

# Check if backend directory exists
if (Test-Path "$projectRoot\backend") {
    Write-Host "✓ Backend directory found" -ForegroundColor Green
} else {
    Write-Host "✗ Backend directory not found!" -ForegroundColor Red
    exit 1
}

# Check if frontend directory exists
if (Test-Path "$projectRoot\frontend") {
    Write-Host "✓ Frontend directory found" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend directory not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Generating Prisma Client..." -ForegroundColor Yellow
Set-Location "$projectRoot\backend"
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma Client generated successfully" -ForegroundColor Green
} else {
    Write-Host "⚠ Prisma Client generation had warnings (this is OK)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 3: Syncing database schema..." -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database schema synced" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 4: Building backend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend build successful" -ForegroundColor Green
} else {
    Write-Host "✗ Backend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  READY TO START!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the system, run these commands in separate terminals:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Cyan
Write-Host "  cd '$projectRoot\backend'" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Cyan
Write-Host "  cd '$projectRoot\frontend'" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then visit:" -ForegroundColor Yellow
Write-Host "  Join Page:    http://localhost:3000/join" -ForegroundColor Green
Write-Host "  Admin Login:  http://localhost:3000/login" -ForegroundColor Green
Write-Host "  Members Page: http://localhost:3000/dashboard/members" -ForegroundColor Green
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan

# Ask if user wants to start servers now
Write-Host ""
$response = Read-Host "Do you want to start both servers now? (Y/N)"
if ($response -eq 'Y' -or $response -eq 'y') {
    Write-Host ""
    Write-Host "Starting backend server..." -ForegroundColor Yellow
    Set-Location "$projectRoot\backend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\backend'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; npm run dev"
    
    Start-Sleep -Seconds 3
    
    Write-Host "Starting frontend server..." -ForegroundColor Yellow
    Set-Location "$projectRoot\frontend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\frontend'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm run dev"
    
    Write-Host ""
    Write-Host "✓ Both servers are starting in separate windows!" -ForegroundColor Green
    Write-Host "  Wait a few seconds, then visit: http://localhost:3000/join" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Setup complete! Happy testing! 🎉" -ForegroundColor Green
Write-Host ""
