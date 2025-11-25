# CI/CD Pipeline Documentation

This document describes the Continuous Integration and Continuous Deployment (CI/CD) setup for the Hirely application.

## Overview

The CI/CD pipeline is implemented using GitHub Actions and includes automated testing, building, security scanning, and deployment workflows.

## Workflows

### 1. Frontend CI (`frontend-ci.yml`)

**Triggers:**
- Push to `main`, `dev`, or `QA` branches (frontend changes)
- Pull requests to `main` or `dev` (frontend changes)

**Jobs:**

#### Lint & Type Check
- Runs ESLint for code quality
- Performs TypeScript type checking
- Ensures code follows style guidelines

#### Unit Tests
- Runs Vitest unit tests
- Generates coverage report
- Uploads coverage to Codecov

#### E2E Tests
- Runs Playwright E2E tests
- Tests user flows and interactions
- Uploads test reports as artifacts

#### Build
- Creates production build
- Validates build process
- Uploads build artifacts

#### Security Scan
- Runs `npm audit` for vulnerability checks
- Integrates with Snyk for security analysis

---

### 2. Backend CI (`backend-ci.yml`)

**Triggers:**
- Push to `main`, `dev`, or `QA` branches (backend changes)
- Pull requests to `main` or `dev` (backend changes)

**Jobs:**

#### Lint & Format Check
- Black code formatting validation
- isort import sorting check
- Flake8 linting

#### Unit Tests
- Runs Django unit tests with PostgreSQL
- Uses Redis for caching tests
- Generates coverage report
- Uploads coverage to Codecov

#### Security Scan
- Safety check for known vulnerabilities
- Bandit security analysis
- Uploads security reports

#### Build Docker
- Builds Docker image
- Validates Dockerfile
- Uses layer caching for efficiency

---

### 3. Production Deployment (`deploy-production.yml`)

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Jobs:**

#### Build & Push Frontend
- Builds Frontend Docker image
- Pushes to GitHub Container Registry
- Tags with branch, SHA, and latest

#### Build & Push Backend
- Builds Backend Docker image
- Pushes to GitHub Container Registry
- Tags with branch, SHA, and latest

#### Deploy to Production
- SSH into production server
- Pulls latest images
- Recreates containers with docker-compose
- Performs health check
- Sends Slack notifications

**Required Secrets:**
- `PRODUCTION_HOST`: Server IP/hostname
- `PRODUCTION_USER`: SSH username
- `PRODUCTION_SSH_KEY`: SSH private key
- `PRODUCTION_URL`: Application URL
- `SLACK_WEBHOOK`: Slack webhook for notifications

---

### 4. Pull Request Checks (`pr-checks.yml`)

**Triggers:**
- Pull requests to `main` or `dev`

**Jobs:**

#### Detect Changes
- Identifies which parts of codebase changed
- Runs only relevant checks

#### Frontend Checks
- Runs if frontend files changed
- Executes lint, type-check, tests, and build

#### Backend Checks
- Runs if backend files changed
- Executes format checks, linting, and tests

#### PR Size Check
- Warns if PR > 500 lines
- Fails if PR > 1000 lines

#### PR Labels
- Ensures PR has appropriate labels
- Required labels: `frontend`, `backend`, `bugfix`, `feature`, `enhancement`, `documentation`

#### Comment on PR
- Posts summary of check results
- Shows status for frontend and backend

---

### 5. Dependency Updates (`dependency-updates.yml`)

**Triggers:**
- Scheduled: Every Monday at 9 AM UTC
- Manual workflow dispatch

**Jobs:**

#### Update Frontend Dependencies
- Checks for outdated npm packages
- Runs `npm update` and `npm audit fix`
- Creates automated PR

#### Update Backend Dependencies
- Checks for outdated Python packages
- Creates review PR (manual update recommended)

#### Security Updates
- Integrates with Dependabot

---

### 6. CodeQL Security Analysis (`codeql-analysis.yml`)

**Triggers:**
- Push to `main` or `dev`
- Pull requests to `main` or `dev`
- Scheduled: Every Saturday at 3 AM UTC

**Jobs:**

#### Analyze JavaScript/TypeScript
- Scans frontend code for security vulnerabilities
- Uses security-and-quality queries

#### Analyze Python
- Scans backend code for security issues
- Identifies potential vulnerabilities

---

### 7. Dependabot (`dependabot.yml`)

Automated dependency updates for:
- **npm packages** (frontend)
- **pip packages** (backend)
- **GitHub Actions**
- **Docker images**

**Schedule:** Weekly on Mondays at 9 AM
**Limits:** 3-5 open PRs per ecosystem
**Reviewers:** @red445992

---

## Setup Instructions

### 1. GitHub Secrets Configuration

Add the following secrets in **Settings > Secrets and variables > Actions**:

#### Required for Production Deployment:
```
PRODUCTION_HOST=your-server-ip
PRODUCTION_USER=deploy-user
PRODUCTION_SSH_KEY=-----BEGIN PRIVATE KEY-----...
PRODUCTION_URL=https://hirely.yourdomain.com
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

#### Optional for Enhanced Security:
```
SNYK_TOKEN=your-snyk-token
CODECOV_TOKEN=your-codecov-token
```

### 2. Branch Protection Rules

Configure in **Settings > Branches > Branch protection rules**:

For `main` branch:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass
  - frontend-checks
  - backend-checks
  - lint-and-typecheck
  - unit-tests
- ✅ Require branches to be up to date
- ✅ Require conversation resolution before merging
- ✅ Require signed commits (recommended)

For `dev` branch:
- ✅ Require pull request reviews
- ✅ Require status checks

### 3. Environment Configuration

Create environments in **Settings > Environments**:

#### Production Environment:
- Add required reviewers
- Configure deployment protection rules
- Add environment secrets

#### Staging Environment (optional):
- Configure for pre-production testing

### 4. Enable GitHub Actions

1. Go to **Settings > Actions > General**
2. Select **Allow all actions and reusable workflows**
3. Set **Workflow permissions** to **Read and write permissions**
4. Enable **Allow GitHub Actions to create and approve pull requests**

### 5. Enable Dependabot

1. Go to **Settings > Code security and analysis**
2. Enable **Dependabot alerts**
3. Enable **Dependabot security updates**
4. The `dependabot.yml` file will configure automated dependency PRs

---

## Workflow Triggers

| Workflow | Push (main/dev/QA) | Pull Request | Scheduled | Manual |
|----------|-------------------|--------------|-----------|--------|
| Frontend CI | ✅ | ✅ | ❌ | ❌ |
| Backend CI | ✅ | ✅ | ❌ | ❌ |
| Production Deploy | ✅ (main only) | ❌ | ❌ | ✅ |
| PR Checks | ❌ | ✅ | ❌ | ❌ |
| Dependency Updates | ❌ | ❌ | ✅ (Weekly) | ✅ |
| CodeQL Analysis | ✅ | ✅ | ✅ (Weekly) | ❌ |

---

## CI/CD Pipeline Flow

### For Feature Development:

```mermaid
graph TD
    A[Create Feature Branch] --> B[Make Changes]
    B --> C[Push to GitHub]
    C --> D[PR Checks Run]
    D --> E{Checks Pass?}
    E -->|No| F[Fix Issues]
    F --> B
    E -->|Yes| G[Code Review]
    G --> H[Merge to dev]
    H --> I[Dev CI Runs]
    I --> J[Auto Deploy to Staging]
```

### For Production Release:

```mermaid
graph TD
    A[Merge dev to main] --> B[Production CI Runs]
    B --> C[Build Docker Images]
    C --> D[Push to Registry]
    D --> E[Deploy to Production]
    E --> F[Health Check]
    F --> G{Healthy?}
    G -->|Yes| H[Notify Success]
    G -->|No| I[Rollback]
    I --> J[Notify Failure]
```

---

## Testing in CI/CD

### Frontend Tests:
- **Unit Tests**: 82 tests using Vitest
- **E2E Tests**: Playwright tests for critical user flows
- **Coverage Threshold**: 80% (recommended)

### Backend Tests:
- **Unit Tests**: 67 tests using Django test framework
- **Integration Tests**: API endpoint testing
- **Database Tests**: PostgreSQL integration

---

## Monitoring & Notifications

### Slack Notifications:
- ✅ Successful deployments
- ❌ Failed deployments
- 🔄 Deployment in progress

### GitHub Notifications:
- PR status checks
- Failed workflows
- Security alerts
- Dependabot PRs

---

## Best Practices

### 1. **Commit Messages**
Follow conventional commits:
```
feat: add user authentication
fix: resolve login redirect issue
chore: update dependencies
docs: update CI/CD documentation
test: add unit tests for auth component
```

### 2. **Pull Requests**
- Keep PRs small (<500 lines)
- Add appropriate labels
- Write descriptive PR descriptions
- Link related issues
- Ensure all checks pass

### 3. **Branch Strategy**
```
main (production)
  └── dev (staging)
       └── feature/* (development)
       └── bugfix/* (bug fixes)
       └── hotfix/* (urgent fixes)
```

### 4. **Security**
- Never commit secrets
- Use GitHub Secrets for sensitive data
- Review Dependabot PRs promptly
- Address CodeQL findings

### 5. **Testing**
- Write tests for new features
- Maintain >80% code coverage
- Run tests locally before pushing
- Fix failing tests immediately

---

## Troubleshooting

### Common Issues:

#### 1. **Tests Failing in CI but Pass Locally**
- Check environment variables
- Verify database/service connectivity
- Review CI logs for details

#### 2. **Docker Build Failures**
- Check Dockerfile syntax
- Verify base image availability
- Review build context

#### 3. **Deployment Failures**
- Verify server connectivity
- Check SSH key permissions
- Review docker-compose configuration

#### 4. **Coverage Reports Not Uploading**
- Verify Codecov token
- Check coverage file paths
- Review upload action logs

---

## Maintenance

### Weekly Tasks:
- ✅ Review Dependabot PRs
- ✅ Check CodeQL findings
- ✅ Monitor build times

### Monthly Tasks:
- ✅ Review and update workflows
- ✅ Audit GitHub Actions usage
- ✅ Update documentation

### Quarterly Tasks:
- ✅ Review branch protection rules
- ✅ Audit secrets and permissions
- ✅ Performance optimization

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Django Testing](https://docs.djangoproject.com/en/stable/topics/testing/)

---

## Support

For CI/CD issues or questions:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Contact DevOps team
4. Create issue in repository

---

**Last Updated:** November 25, 2025
**Maintained By:** DevOps Team
**Version:** 1.0.0
