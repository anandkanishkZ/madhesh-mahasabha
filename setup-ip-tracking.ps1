# IP Tracking Setup Script
# Run this from the project root directory

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IP Tracking Setup for Contact Forms  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Navigate to backend
Write-Host "[Step 1/4] Navigating to backend directory..." -ForegroundColor Yellow
Set-Location -Path ".\backend"

# Step 2: Generate Prisma Client
Write-Host "[Step 2/4] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

# Step 3: Apply Database Migration
Write-Host "[Step 3/4] Applying database migration..." -ForegroundColor Yellow
npx prisma db push

# Step 4: Success Message
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Setup Complete!                    " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart your backend server: npm run dev" -ForegroundColor White
Write-Host "2. Test the contact form submission" -ForegroundColor White
Write-Host "3. Check the dashboard to see IP address" -ForegroundColor White
Write-Host ""
Write-Host "For detailed documentation, see: SETUP_IP_TRACKING.md" -ForegroundColor Yellow
Write-Host ""

# Return to project root
Set-Location -Path ".."
