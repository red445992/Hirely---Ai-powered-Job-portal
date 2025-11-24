# PowerShell Test Runner Script for Windows
# Run backend tests with coverage

Write-Host "🧪 Running Hirely Backend Tests..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Install test dependencies if needed
Write-Host "`n📦 Installing test dependencies..." -ForegroundColor Yellow
pip install -q -r requirements-test.txt

# Run tests with coverage
Write-Host "`n🔬 Running tests..." -ForegroundColor Yellow
pytest -v --cov --cov-report=html --cov-report=term-missing

# Check exit code
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ All tests passed!" -ForegroundColor Green
    Write-Host "📊 Coverage report generated in htmlcov/index.html" -ForegroundColor Green
} else {
    Write-Host "`n❌ Some tests failed!" -ForegroundColor Red
    exit 1
}
