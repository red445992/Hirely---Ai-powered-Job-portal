# CI/CD Setup Checklist

Complete this checklist to ensure your CI/CD pipeline is fully configured and operational.

## ✅ Initial Setup

### 1. Repository Configuration
- [ ] Repository created on GitHub
- [ ] Code pushed to `main` branch
- [ ] `dev` branch created
- [ ] `.github` directory with workflows committed

### 2. Branch Protection
- [ ] Navigate to Settings → Branches
- [ ] Add protection rule for `main`:
  - [ ] Require pull request reviews (1+ reviewers)
  - [ ] Require status checks:
    - [ ] `lint-and-typecheck`
    - [ ] `unit-tests`
    - [ ] `e2e-tests` (frontend)
    - [ ] `build`
  - [ ] Require branches to be up to date
  - [ ] Require conversation resolution
- [ ] Add protection rule for `dev`:
  - [ ] Require pull request reviews
  - [ ] Require status checks to pass

---

## 🔐 Secrets Configuration

### 3. Production Deployment Secrets
Go to: Settings → Secrets and variables → Actions → New repository secret

- [ ] `PRODUCTION_HOST` - Server IP or hostname
- [ ] `PRODUCTION_USER` - SSH username
- [ ] `PRODUCTION_SSH_KEY` - SSH private key (full content)
- [ ] `PRODUCTION_URL` - Application URL (https://...)
- [ ] `SLACK_WEBHOOK` - Slack webhook URL

**Command to verify:**
```bash
gh secret list
```

### 4. Optional Enhancement Secrets
- [ ] `SNYK_TOKEN` - For security scanning
- [ ] `CODECOV_TOKEN` - For coverage reports

---

## 🚀 GitHub Actions Configuration

### 5. Enable GitHub Actions
- [ ] Go to Settings → Actions → General
- [ ] Select "Allow all actions and reusable workflows"
- [ ] Workflow permissions: "Read and write permissions"
- [ ] Enable "Allow GitHub Actions to create and approve pull requests"

### 6. Enable Dependabot
- [ ] Go to Settings → Code security and analysis
- [ ] Enable "Dependabot alerts"
- [ ] Enable "Dependabot security updates"
- [ ] Verify `dependabot.yml` is in `.github/` directory

### 7. Create Environments
- [ ] Go to Settings → Environments
- [ ] Create `production` environment:
  - [ ] Add required reviewers
  - [ ] Configure deployment protection rules
  - [ ] Add environment-specific secrets if needed
- [ ] Create `staging` environment (optional)

---

## 🧪 Testing Configuration

### 8. Frontend Testing
- [ ] Navigate to `hirely-frontend/`
- [ ] Run: `npm ci`
- [ ] Run: `npm run test:run` (verify 82 tests pass)
- [ ] Run: `npm run test:e2e` (verify Playwright tests pass)
- [ ] Run: `npm run lint:check` (verify no errors)
- [ ] Run: `npm run type-check` (verify no errors)

### 9. Backend Testing
- [ ] Navigate to `backend/HirelyBackend/`
- [ ] Run: `pip install -r requirements.txt`
- [ ] Run: `python manage.py test` (verify 67 tests pass)
- [ ] Install linters: `pip install black isort flake8`
- [ ] Run: `black --check .`
- [ ] Run: `isort --check-only .`
- [ ] Run: `flake8 .`

---

## 🐳 Docker Configuration

### 10. Docker Setup
- [ ] Verify `Dockerfile` exists in `hirely-frontend/`
- [ ] Verify `Dockerfile` exists in `backend/HirelyBackend/`
- [ ] Test frontend build: `docker build -t hirely-frontend ./hirely-frontend`
- [ ] Test backend build: `docker build -t hirely-backend ./backend/HirelyBackend`
- [ ] Verify `docker-compose.yml` exists in root

---

## 🌐 Production Server Setup

### 11. Server Preparation
- [ ] Server accessible via SSH
- [ ] Docker installed on server
- [ ] Docker Compose installed on server
- [ ] User has sudo/docker permissions
- [ ] SSH key added to server's `~/.ssh/authorized_keys`
- [ ] Firewall configured (ports 80, 443, 22)

**Verify SSH access:**
```bash
ssh -i ~/.ssh/your_key user@production-host
```

### 12. Server Directory Structure
SSH into server and create:
```bash
sudo mkdir -p /opt/hirely
sudo chown $USER:$USER /opt/hirely
cd /opt/hirely
# Clone or copy docker-compose.yml and .env files here
```

- [ ] `/opt/hirely` directory created
- [ ] `docker-compose.yml` deployed
- [ ] `.env` file with production variables created
- [ ] SSL certificates configured (if using HTTPS)

---

## 🔔 Notification Setup

### 13. Slack Integration
- [ ] Create Slack workspace or use existing
- [ ] Create channel (e.g., `#deployments`)
- [ ] Create Slack app: https://api.slack.com/apps
- [ ] Enable Incoming Webhooks
- [ ] Add webhook to channel
- [ ] Copy webhook URL to `SLACK_WEBHOOK` secret
- [ ] Test notification:
```bash
curl -X POST -H 'Content-Type: application/json' \
  -d '{"text":"Test from Hirely CI/CD"}' \
  YOUR_WEBHOOK_URL
```

---

## 📊 Coverage & Security Tools

### 14. Codecov Setup (Optional)
- [ ] Sign up at https://codecov.io with GitHub
- [ ] Add repository
- [ ] Copy upload token
- [ ] Add `CODECOV_TOKEN` to GitHub secrets
- [ ] Add badge to README.md

### 15. Snyk Setup (Optional)
- [ ] Sign up at https://snyk.io with GitHub
- [ ] Add repository
- [ ] Get API token from Account Settings
- [ ] Add `SNYK_TOKEN` to GitHub secrets

---

## 🧪 Workflow Testing

### 16. Test Frontend CI
- [ ] Create branch: `git checkout -b test/frontend-ci`
- [ ] Make change in `hirely-frontend/`
- [ ] Push: `git push origin test/frontend-ci`
- [ ] Check GitHub Actions tab
- [ ] Verify all jobs pass:
  - [ ] Lint & Type Check
  - [ ] Unit Tests
  - [ ] E2E Tests
  - [ ] Build
  - [ ] Security Scan

### 17. Test Backend CI
- [ ] Create branch: `git checkout -b test/backend-ci`
- [ ] Make change in `backend/`
- [ ] Push: `git push origin test/backend-ci`
- [ ] Check GitHub Actions tab
- [ ] Verify all jobs pass:
  - [ ] Lint & Format Check
  - [ ] Unit Tests
  - [ ] Security Scan
  - [ ] Build Docker

### 18. Test PR Workflow
- [ ] Create PR from test branch to `dev`
- [ ] Verify PR checks run
- [ ] Check for automated comment
- [ ] Verify status badges update
- [ ] Add required labels
- [ ] Verify all checks pass before merge

### 19. Test Deployment Workflow
**Warning: Only do this when ready for production deployment**
- [ ] Merge changes to `main` branch
- [ ] Monitor GitHub Actions
- [ ] Verify Docker images build
- [ ] Verify images push to registry
- [ ] Verify deployment to server
- [ ] Check health endpoint
- [ ] Verify Slack notification received
- [ ] Test application: Visit `PRODUCTION_URL`

---

## 📚 Documentation

### 20. Update Documentation
- [ ] Add CI/CD badges to README.md (already done ✓)
- [ ] Document required secrets in team wiki
- [ ] Share `CI_CD_QUICK_REFERENCE.md` with team
- [ ] Update deployment runbook
- [ ] Document rollback procedure

### 21. Team Onboarding
- [ ] Share `ENVIRONMENT_SETUP.md` with team
- [ ] Walk through workflow triggers
- [ ] Explain branch protection rules
- [ ] Demo PR process
- [ ] Show how to view workflow logs
- [ ] Explain emergency procedures

---

## 🔍 Monitoring & Maintenance

### 22. Post-Deployment Verification
- [ ] Monitor first few deployments closely
- [ ] Check application logs
- [ ] Verify database migrations
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Set up uptime monitoring (optional)

### 23. Ongoing Maintenance
- [ ] Review Dependabot PRs weekly
- [ ] Check CodeQL findings weekly
- [ ] Monitor workflow execution times
- [ ] Review failed workflows immediately
- [ ] Update workflows as needed
- [ ] Rotate secrets quarterly
- [ ] Review branch protection rules monthly

---

## 🎯 Final Verification

### 24. Complete System Test
- [ ] Frontend CI passes on push
- [ ] Backend CI passes on push
- [ ] PR checks work correctly
- [ ] Deployments succeed
- [ ] Health checks pass
- [ ] Notifications received
- [ ] Rollback tested (in staging)
- [ ] Team can access and understand workflows

---

## 📋 Success Criteria

All workflows should:
- ✅ Run automatically on appropriate triggers
- ✅ Complete in reasonable time (< 10 minutes)
- ✅ Provide clear failure messages
- ✅ Send notifications on completion
- ✅ Block merges when checks fail
- ✅ Deploy successfully to production

---

## 🆘 Troubleshooting

If any step fails:
1. Check workflow logs in GitHub Actions tab
2. Verify secrets are correctly set
3. Ensure server is accessible
4. Review [CI_CD_DOCUMENTATION.md](./CI_CD_DOCUMENTATION.md)
5. Check [CI_CD_QUICK_REFERENCE.md](./CI_CD_QUICK_REFERENCE.md)
6. Review [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)

---

## ✨ Next Steps After Setup

1. **Train Team**: Ensure all developers understand the workflow
2. **Monitor First Week**: Watch deployments closely
3. **Gather Feedback**: Get team input on process
4. **Optimize**: Improve workflow times if needed
5. **Scale**: Add staging environment if needed
6. **Enhance**: Add performance testing, load testing

---

## 📞 Support Resources

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Docker Docs**: https://docs.docker.com/
- **CI/CD Best Practices**: [CI_CD_DOCUMENTATION.md](./CI_CD_DOCUMENTATION.md)
- **Quick Reference**: [CI_CD_QUICK_REFERENCE.md](./CI_CD_QUICK_REFERENCE.md)

---

**Setup Date:** _________________

**Completed By:** _________________

**Team Notified:** _________________

**Production Deploy Date:** _________________

---

**Note:** Keep this checklist for reference and update it as your CI/CD pipeline evolves.
