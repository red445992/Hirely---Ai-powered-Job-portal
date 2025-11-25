# CI/CD Quick Reference Guide

## 🚀 Quick Start

### Running Workflows Locally

#### Frontend Tests
```bash
cd hirely-frontend
npm ci
npm run lint:check
npm run type-check
npm run test:run
npm run test:e2e
```

#### Backend Tests
```bash
cd backend/HirelyBackend
pip install -r requirements.txt
python manage.py test
black --check .
isort --check-only .
flake8 .
```

---

## 📊 Workflow Status Badges

Add to your README or documentation:

```markdown
[![Frontend CI](https://github.com/red445992/Hirely---Ai-powered-Job-portal/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/red445992/Hirely---Ai-powered-Job-portal/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/red445992/Hirely---Ai-powered-Job-portal/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/red445992/Hirely---Ai-powered-Job-portal/actions/workflows/backend-ci.yml)
```

---

## 🔑 Required GitHub Secrets

### Production Deployment
```bash
PRODUCTION_HOST=your-server-ip
PRODUCTION_USER=deploy-user
PRODUCTION_SSH_KEY=your-ssh-private-key
PRODUCTION_URL=https://hirely.yourdomain.com
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK
```

### Optional (Enhanced Features)
```bash
SNYK_TOKEN=your-snyk-token
CODECOV_TOKEN=your-codecov-token
```

---

## 🌿 Branch Strategy

```
main          → Production (auto-deploy)
dev           → Staging (auto-deploy)
feature/*     → Development
bugfix/*      → Bug fixes
hotfix/*      → Urgent production fixes
```

---

## 📝 Commit Message Convention

```bash
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc
refactor: code restructuring
test: adding tests
chore: updating dependencies, configs
```

---

## ✅ Pre-Push Checklist

- [ ] Tests pass locally
- [ ] Code is linted
- [ ] Types are checked (frontend)
- [ ] No console.log statements
- [ ] Environment variables documented
- [ ] Commit messages follow convention

---

## 🔄 Workflow Triggers

| Action | Workflows Triggered |
|--------|-------------------|
| Push to `main` | Frontend CI, Backend CI, Deploy Production, CodeQL |
| Push to `dev` | Frontend CI, Backend CI, CodeQL |
| Push to `QA` | Frontend CI, Backend CI |
| Create PR | PR Checks, Frontend CI, Backend CI |
| Monday 9 AM | Dependency Updates |
| Saturday 3 AM | CodeQL Security Scan |

---

## 🐛 Debugging Failed Workflows

### 1. View Logs
```bash
# Go to: Actions tab → Select workflow → View logs
```

### 2. Re-run Failed Jobs
```bash
# Click "Re-run failed jobs" button
```

### 3. Check Common Issues

**Frontend Build Fails:**
- Check `package.json` scripts
- Verify environment variables
- Review build logs

**Backend Tests Fail:**
- Check database connection
- Verify migrations
- Review test output

**Deployment Fails:**
- Check SSH connection
- Verify secrets
- Check server logs

---

## 📦 Dependency Management

### Auto-Updates via Dependabot
- Runs every Monday at 9 AM
- Creates PRs for updates
- Review and merge when ready

### Manual Updates

**Frontend:**
```bash
cd hirely-frontend
npm outdated
npm update
npm audit fix
```

**Backend:**
```bash
cd backend/HirelyBackend
pip list --outdated
pip install --upgrade package-name
```

---

## 🔒 Security Scanning

### CodeQL Analysis
- Runs on push to main/dev
- Runs on PRs
- Weekly scheduled scan (Saturdays)

### Manual Security Check

**Frontend:**
```bash
npm audit
npm audit fix
```

**Backend:**
```bash
pip install safety
safety check
```

---

## 🎯 Testing Coverage

### Frontend
- **Target**: 80% coverage
- **Current**: 82/82 tests passing
- **View**: `npm run test:coverage`

### Backend
- **Target**: 80% coverage
- **Current**: 67/67 tests passing
- **View**: `coverage run manage.py test && coverage report`

---

## 🚢 Deployment Process

### Automatic (via CI/CD)
1. Merge PR to `main`
2. Workflows run automatically
3. Docker images built & pushed
4. Deployment to production
5. Health check performed
6. Slack notification sent

### Manual Deployment
```bash
# Trigger via GitHub UI:
# Actions → Deploy to Production → Run workflow
```

### Rollback
```bash
# SSH to production server
ssh user@production-host

# Rollback using docker-compose
cd /opt/hirely
docker-compose down
git checkout <previous-commit>
docker-compose up -d
```

---

## 📈 Monitoring

### View Workflow Runs
```
https://github.com/red445992/Hirely---Ai-powered-Job-portal/actions
```

### Check Coverage Reports
- Codecov: `https://codecov.io/gh/red445992/Hirely---Ai-powered-Job-portal`

### Security Alerts
- Settings → Security → Code scanning alerts

---

## 🆘 Emergency Procedures

### Hotfix Process
```bash
# 1. Create hotfix branch from main
git checkout main
git pull
git checkout -b hotfix/critical-bug

# 2. Make fix and test
# ... make changes ...
npm test  # or python manage.py test

# 3. Push and create PR
git push origin hotfix/critical-bug

# 4. Merge to main (bypasses normal PR checks if urgent)

# 5. Merge to dev to keep in sync
git checkout dev
git merge main
```

### Disable Deployment
```bash
# Method 1: Disable workflow in GitHub UI
# Actions → Deploy Production → ⋯ → Disable workflow

# Method 2: Add condition to workflow
# Edit .github/workflows/deploy-production.yml
# Add: if: false
```

---

## 📚 Additional Resources

- [Full CI/CD Documentation](./CI_CD_DOCUMENTATION.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Docker Setup](./DOCKER_SETUP.md)
- [Project Summary](./PROJECT_SUMMARY.md)

---

## 💡 Tips & Best Practices

1. **Always pull latest before starting work**
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Create feature branch from dev**
   ```bash
   git checkout -b feature/my-feature
   ```

3. **Keep PRs small and focused**
   - Aim for < 500 lines changed
   - One feature per PR

4. **Write tests for new features**
   - Unit tests required
   - E2E tests for critical flows

5. **Review CI logs before merging**
   - Ensure all checks pass
   - Review coverage reports

6. **Monitor Dependabot PRs**
   - Review weekly
   - Test before merging
   - Keep dependencies updated

---

**Quick Help:**
- CI/CD Issues: Check [CI_CD_DOCUMENTATION.md](./CI_CD_DOCUMENTATION.md)
- Test Issues: Check [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- Docker Issues: Check [DOCKER_SETUP.md](./DOCKER_SETUP.md)
