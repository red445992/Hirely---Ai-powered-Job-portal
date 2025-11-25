# Environment Variables for CI/CD

## GitHub Actions Secrets Setup

### Required Secrets (Production Deployment)

#### PRODUCTION_HOST
```
Type: string
Description: IP address or hostname of production server
Example: 192.168.1.100 or hirely.yourdomain.com
```

#### PRODUCTION_USER
```
Type: string
Description: SSH username for production server
Example: deploy or ubuntu
```

#### PRODUCTION_SSH_KEY
```
Type: multiline string
Description: Private SSH key for authentication
Example:
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
...
-----END OPENSSH PRIVATE KEY-----
```

#### PRODUCTION_URL
```
Type: string
Description: Full URL of production application
Example: https://hirely.yourdomain.com
```

#### SLACK_WEBHOOK
```
Type: string
Description: Slack webhook URL for notifications
Example: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX
How to get: Slack Settings → Incoming Webhooks → Add to Slack
```

---

### Optional Secrets (Enhanced Features)

#### SNYK_TOKEN
```
Type: string
Description: Snyk API token for security scanning
Example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
How to get: https://app.snyk.io/account → API Token
```

#### CODECOV_TOKEN
```
Type: string
Description: Codecov upload token for coverage reports
Example: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
How to get: https://codecov.io → Settings → Repository Upload Token
```

---

## Setting Up Secrets in GitHub

### Via GitHub UI:
1. Go to repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Enter name and value
5. Click "Add secret"

### Via GitHub CLI:
```bash
# Install GitHub CLI
# https://cli.github.com/

# Login
gh auth login

# Add secrets
gh secret set PRODUCTION_HOST --body "your-server-ip"
gh secret set PRODUCTION_USER --body "deploy"
gh secret set PRODUCTION_SSH_KEY < ~/.ssh/id_rsa
gh secret set PRODUCTION_URL --body "https://hirely.yourdomain.com"
gh secret set SLACK_WEBHOOK --body "your-webhook-url"
```

---

## Environment Variables for Local Development

### Frontend (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret

# AI Services
NEXT_PUBLIC_GOOGLE_API_KEY=your-google-api-key
NEXT_PUBLIC_VAPI_KEY=your-vapi-key

# Database (Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/hirely

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_INTERVIEWS=true
NEXT_PUBLIC_ENABLE_RESUME_SCORING=true
```

### Backend (.env)
```bash
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hirely
DB_NAME=hirely
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# AI Services
GOOGLE_API_KEY=your-google-api-key

# Email (optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-password

# Security
JWT_SECRET_KEY=your-jwt-secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440
```

---

## CI/CD Environment Variables

### Automatically Available in GitHub Actions:

```yaml
# GitHub Context
${{ github.sha }}              # Commit SHA
${{ github.ref }}              # Branch reference
${{ github.ref_name }}         # Branch name
${{ github.actor }}            # User who triggered workflow
${{ github.repository }}       # Repository name
${{ github.event_name }}       # Event that triggered workflow

# Runner Context
${{ runner.os }}               # Operating system
${{ runner.temp }}             # Temp directory

# Environment
${{ env.VARIABLE_NAME }}       # Custom environment variable
```

### Custom Environment Variables in Workflows:

```yaml
env:
  NODE_ENV: production
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_URL: https://api.hirely.com
```

---

## Docker Environment Variables

### docker-compose.yml
```yaml
services:
  backend:
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - DEBUG=${DEBUG:-False}
      - ALLOWED_HOSTS=${ALLOWED_HOSTS}

  frontend:
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
      - DATABASE_URL=${DATABASE_URL}
```

---

## Security Best Practices

### ✅ DO:
- Use GitHub Secrets for sensitive data
- Rotate credentials regularly
- Use different secrets for staging/production
- Enable secret scanning in repository
- Use least-privilege access
- Document required secrets

### ❌ DON'T:
- Commit secrets to repository
- Share secrets in plain text
- Use production secrets in development
- Log secret values
- Hardcode credentials
- Store secrets in workflow files

---

## Generating SSH Keys for Deployment

```bash
# Generate new SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Copy public key to production server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@production-host

# Or manually:
cat ~/.ssh/github_actions_deploy.pub
# Copy output and add to server's ~/.ssh/authorized_keys

# Add private key to GitHub Secrets
cat ~/.ssh/github_actions_deploy
# Copy entire output including BEGIN/END lines
# Add as PRODUCTION_SSH_KEY secret
```

---

## Setting Up Slack Notifications

### 1. Create Slack App
1. Go to https://api.slack.com/apps
2. Click "Create New App"
3. Choose "From scratch"
4. Name: "Hirely CI/CD Notifications"
5. Select your workspace

### 2. Enable Incoming Webhooks
1. Navigate to "Incoming Webhooks"
2. Toggle "Activate Incoming Webhooks" to On
3. Click "Add New Webhook to Workspace"
4. Select channel (e.g., #deployments)
5. Click "Allow"

### 3. Copy Webhook URL
1. Copy the webhook URL
2. Add to GitHub Secrets as `SLACK_WEBHOOK`

### 4. Test Notification
```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"text":"Test notification from Hirely CI/CD"}' \
  YOUR_WEBHOOK_URL
```

---

## Codecov Integration

### 1. Sign Up
1. Go to https://codecov.io
2. Sign in with GitHub
3. Add repository

### 2. Get Upload Token
1. Select repository
2. Go to Settings
3. Copy "Repository Upload Token"
4. Add to GitHub Secrets as `CODECOV_TOKEN`

### 3. Badge
```markdown
[![codecov](https://codecov.io/gh/red445992/Hirely---Ai-powered-Job-portal/branch/main/graph/badge.svg)](https://codecov.io/gh/red445992/Hirely---Ai-powered-Job-portal)
```

---

## Snyk Security Integration

### 1. Sign Up
1. Go to https://snyk.io
2. Sign up with GitHub
3. Add repository

### 2. Get API Token
1. Go to Account Settings
2. Navigate to "API Token"
3. Click "Show" and copy
4. Add to GitHub Secrets as `SNYK_TOKEN`

### 3. Configure
The workflow already includes Snyk scanning. Just add the token.

---

## Environment-Specific Configs

### Production
```bash
DEBUG=False
ALLOWED_HOSTS=hirely.yourdomain.com
DATABASE_URL=postgresql://user:pass@prod-db:5432/hirely_prod
REDIS_URL=redis://prod-redis:6379
LOG_LEVEL=INFO
```

### Staging
```bash
DEBUG=False
ALLOWED_HOSTS=staging.hirely.yourdomain.com
DATABASE_URL=postgresql://user:pass@staging-db:5432/hirely_staging
REDIS_URL=redis://staging-redis:6379
LOG_LEVEL=DEBUG
```

### Development
```bash
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hirely_dev
REDIS_URL=redis://localhost:6379
LOG_LEVEL=DEBUG
```

---

## Verification Checklist

- [ ] All required secrets added to GitHub
- [ ] SSH key properly configured
- [ ] Production server accessible
- [ ] Slack webhook working
- [ ] Environment files created
- [ ] Database credentials valid
- [ ] API keys activated
- [ ] Secrets documented
- [ ] Team members have access
- [ ] Backup of secrets stored securely

---

**Important:** Keep this file updated when adding new secrets or environment variables.
