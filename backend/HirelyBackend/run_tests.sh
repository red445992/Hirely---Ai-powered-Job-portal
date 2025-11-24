#!/bin/bash
# Test runner script for backend

echo "🧪 Running Hirely Backend Tests..."
echo "=================================="

# Install test dependencies if needed
pip install -q -r requirements-test.txt

# Run tests with coverage
pytest -v --cov --cov-report=html --cov-report=term-missing

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
    echo "📊 Coverage report generated in htmlcov/index.html"
else
    echo ""
    echo "❌ Some tests failed!"
    exit 1
fi
