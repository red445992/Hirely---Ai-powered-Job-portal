# 🧪 Quick Test Commands Reference

## Run Tests
```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific file
pytest users/tests/test_authentication.py

# Run specific class
pytest users/tests/test_authentication.py::TestUserLogin

# Run specific test
pytest users/tests/test_authentication.py::TestUserLogin::test_login_success

# Run tests matching pattern
pytest -k "login"

# Run tests with specific marker
pytest -m "slow"
```

## Coverage
```bash
# Run with coverage
pytest --cov

# Coverage with HTML report
pytest --cov --cov-report=html

# Coverage for specific module
pytest --cov=applications --cov-report=term-missing

# View HTML coverage
open htmlcov/index.html  # Mac/Linux
start htmlcov/index.html  # Windows
```

## Debugging
```bash
# Show print statements
pytest -s

# Stop at first failure
pytest -x

# Drop into debugger on failure
pytest --pdb

# Show full traceback
pytest --tb=long

# Show local variables in traceback
pytest -l
```

## Performance
```bash
# Show slowest tests
pytest --durations=10

# Run in parallel (requires pytest-xdist)
pytest -n auto
```

## Useful Options
```bash
# Rerun failed tests
pytest --lf

# Run failed tests first, then others
pytest --ff

# Collect only (don't run)
pytest --co

# Quiet mode
pytest -q

# Very verbose
pytest -vv
```

## Common Combos
```bash
# Full test run with coverage
pytest -v --cov --cov-report=html --cov-report=term-missing

# Quick debug single test
pytest path/to/test.py::test_name -vv -s

# Run specific tests with coverage
pytest users/tests/ -v --cov=users --cov-report=term-missing
```
