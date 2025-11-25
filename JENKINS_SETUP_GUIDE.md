# Jenkins Setup Guide - Complete Step-by-Step

This guide will walk you through setting up Jenkins CI/CD pipeline for the Hirely application from scratch.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Jenkins Installation](#jenkins-installation)
3. [Initial Jenkins Setup](#initial-jenkins-setup)
4. [Jenkins Configuration](#jenkins-configuration)
5. [Creating the Pipeline Job](#creating-the-pipeline-job)
6. [Configuring Credentials](#configuring-credentials)
7. [Running Your First Build](#running-your-first-build)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Software
- ✅ **Java JDK 11 or 17** (Jenkins requirement)
- ✅ **Docker Desktop** (for building images)
- ✅ **Git** (for repository access)
- ✅ **Node.js 20+** (for frontend builds)
- ✅ **Python 3.11+** (for backend tests)

### Required Accounts
- ✅ **GitHub Account** (repository access)
- ✅ **Docker Hub Account** (image registry)

### Check Prerequisites
```bash
# Check Java
java -version

# Check Docker
docker --version
docker-compose --version

# Check Git
git --version

# Check Node
node --version
npm --version

# Check Python
python --version
```

---

## 2. Jenkins Installation

### Option A: Install Jenkins on Windows

#### Step 1: Download Jenkins
1. Visit: https://www.jenkins.io/download/
2. Download **Windows Installer** (.msi file)
3. Or download **Generic Java Package** (.war file)

#### Step 2: Install Jenkins (MSI Method)
```powershell
# Run the downloaded .msi installer
# Follow the installation wizard
# Default installation path: C:\Program Files\Jenkins

# Jenkins will install as a Windows Service
# Default port: 8080
```

#### Step 3: Start Jenkins Service
```powershell
# Check if Jenkins service is running
Get-Service jenkins

# Start Jenkins service
Start-Service jenkins

# Or use Services Manager:
# Press Win+R → services.msc → Find Jenkins → Start
```

#### Step 4: Access Jenkins
```
Open browser: http://localhost:8080
```

### Option B: Run Jenkins in Docker (Easier)

```bash
# Pull Jenkins image
docker pull jenkins/jenkins:lts

# Create volume for Jenkins data
docker volume create jenkins_home

# Run Jenkins container
docker run -d \
  --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts

# View initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

---

## 3. Initial Jenkins Setup

### Step 1: Unlock Jenkins

1. **Access Jenkins**: Open http://localhost:8080
2. **Get Initial Password**:

**If installed via MSI:**
```powershell
# Password location
Get-Content "C:\Program Files\Jenkins\secrets\initialAdminPassword"
```

**If running in Docker:**
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

3. **Copy and paste** the password into Jenkins unlock page

### Step 2: Install Suggested Plugins

1. Click **"Install suggested plugins"**
2. Wait for plugins to install (5-10 minutes)
3. Installed plugins include:
   - Git plugin
   - Pipeline plugin
   - Docker plugin
   - GitHub plugin
   - Email Extension plugin

### Step 3: Create First Admin User

Fill in the form:
```
Username: admin
Password: [your-secure-password]
Full Name: [Your Name]
Email: [your-email@example.com]
```

Click **"Save and Continue"**

### Step 4: Configure Jenkins URL

```
Jenkins URL: http://localhost:8080
```

Click **"Save and Finish"** → **"Start using Jenkins"**

---

## 4. Jenkins Configuration

### Step 1: Install Required Plugins

1. Go to **Dashboard → Manage Jenkins → Plugins**
2. Click **"Available plugins"**
3. Search and install:
   - ✅ **Docker Pipeline**
   - ✅ **Docker plugin**
   - ✅ **GitHub Integration**
   - ✅ **NodeJS plugin**
   - ✅ **Email Extension Plugin**
   - ✅ **Credentials Binding Plugin**

4. Click **"Install without restart"**
5. Check **"Restart Jenkins when installation is complete"**

### Step 2: Configure Global Tools

#### A. Configure JDK
1. **Manage Jenkins → Tools**
2. Scroll to **JDK installations**
3. Click **"Add JDK"**
   - Name: `JDK-11`
   - Install automatically: ✅
   - Add installer: Choose **"Install from java.sun.com"**

#### B. Configure Git
1. Scroll to **Git installations**
2. Click **"Add Git"**
   - Name: `Default`
   - Path to Git executable: `git` (or `C:\Program Files\Git\bin\git.exe` on Windows)

#### C. Configure Node.js
1. Scroll to **NodeJS installations**
2. Click **"Add NodeJS"**
   - Name: `NodeJS-20`
   - Version: `20.x.x`
   - Install automatically: ✅

#### D. Configure Docker
1. Scroll to **Docker installations**
2. Click **"Add Docker"**
   - Name: `Docker`
   - Install automatically: ✅
   - Docker version: Latest

3. Click **"Save"**

---

## 5. Creating the Pipeline Job

### Step 1: Create New Pipeline Job

1. Go to **Jenkins Dashboard**
2. Click **"New Item"**
3. Enter job name: `Hirely-CI-CD-Pipeline`
4. Select **"Pipeline"**
5. Click **"OK"**

### Step 2: Configure General Settings

#### Description
```
CI/CD Pipeline for Hirely Application
- Runs tests (Backend + Frontend)
- Builds Docker images
- Pushes to Docker Hub
- Deploys with Docker Compose
```

#### GitHub Project (Optional)
- ✅ Check **"GitHub project"**
- Project URL: `https://github.com/red445992/Hirely---Ai-powered-Job-portal/`

### Step 3: Configure Build Triggers

Choose one or more:

#### Option A: Poll SCM (Check for changes)
- ✅ Check **"Poll SCM"**
- Schedule: `H/5 * * * *` (Check every 5 minutes)

#### Option B: GitHub Hook Trigger (Recommended)
- ✅ Check **"GitHub hook trigger for GITScm polling"**
- This triggers build automatically when you push to GitHub

#### Option C: Manual Trigger Only
- Leave unchecked (build manually)

### Step 4: Configure Pipeline

#### Pipeline Definition
- Select: **"Pipeline script from SCM"**

#### SCM
- Select: **Git**

#### Repositories
- **Repository URL**: `https://github.com/red445992/Hirely---Ai-powered-Job-portal.git`
- **Credentials**: (Add GitHub credentials - see next section)

#### Branches to build
- **Branch Specifier**: `*/QA` (or `*/main` for production)

#### Script Path
- **Script Path**: `Jenkinsfile` (default)

#### Additional Behaviors (Optional)
- Click **"Add"** → **"Clean before checkout"** (recommended)

5. Click **"Save"**

---

## 6. Configuring Credentials

### Step 1: Add GitHub Credentials

1. Go to **Dashboard → Manage Jenkins → Credentials**
2. Click **(global)** domain
3. Click **"Add Credentials"**

#### For Private Repository:
```
Kind: Username with password
Scope: Global
Username: red445992
Password: [Your GitHub Personal Access Token]
ID: github-credentials
Description: GitHub Access
```

**How to create GitHub Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token (classic)"**
3. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `admin:repo_hook` (for webhooks)
4. Generate token and copy it
5. Use this token as password in Jenkins

### Step 2: Add Docker Hub Credentials

1. Click **"Add Credentials"** again

```
Kind: Username with password
Scope: Global
Username: [Your Docker Hub Username]
Password: [Your Docker Hub Password or Access Token]
ID: docker-hub-credentials
Description: Docker Hub Access
```

**How to create Docker Hub Access Token:**
1. Login to Docker Hub: https://hub.docker.com
2. Account Settings → Security → New Access Token
3. Name: `Jenkins-CI`
4. Permissions: `Read, Write, Delete`
5. Generate and copy token
6. Use this token as password in Jenkins

### Step 3: Add Environment Variables (Optional)

1. Go back to your pipeline job
2. Click **"Configure"**
3. Check **"This project is parameterized"**
4. Add parameters:

```
GOOGLE_GENERATIVE_API_KEY
NEXT_PUBLIC_VAPI_WEB_TOKEN
NEXT_PUBLIC_VAPI_WORKFLOW_ID
DATABASE_URL
```

---

## 7. Running Your First Build

### Step 1: Trigger Manual Build

1. Go to your pipeline job: `Hirely-CI-CD-Pipeline`
2. Click **"Build Now"**
3. Watch the build in **"Build History"**
4. Click on build number (e.g., `#1`)
5. Click **"Console Output"** to see logs

### Step 2: Monitor Build Progress

The build will go through these stages:
1. ✅ **Checkout Code** - Cloning from GitHub
2. ✅ **Environment Setup** - Preparing workspace
3. ✅ **Backend Tests** - Running 67 tests
4. ✅ **Frontend Tests** - Running 82 tests
5. ✅ **Build Backend Docker Image**
6. ✅ **Build Frontend Docker Image**
7. ✅ **Push Docker Images** - To Docker Hub
8. ✅ **Deploy with Docker Compose**
9. ✅ **Health Check** - Verify deployment

### Step 3: View Build Results

**Console Output shows:**
```
[Pipeline] stage (Checkout Code)
[Pipeline] { (Checkout Code)
Checking out code from GitHub...
...

[Pipeline] stage (Backend Tests)
Running Backend Tests...
...
Ran 67 tests in 12.345s
OK

[Pipeline] stage (Frontend Tests)
Running Frontend Tests...
...
82 passed (82)

[Pipeline] Success
Pipeline completed successfully!
```

### Step 4: Verify Deployment

```bash
# Check running containers
docker ps

# Check backend
curl http://localhost:8000/admin/

# Check frontend
curl http://localhost:3000/

# View Docker images on Docker Hub
# Visit: https://hub.docker.com/u/red445992
```

---

## 8. Troubleshooting

### Issue 1: "Docker not found"

**Solution:**
```powershell
# Ensure Docker Desktop is running
docker --version

# Add Docker to PATH
# System Properties → Environment Variables → Path
# Add: C:\Program Files\Docker\Docker\resources\bin
```

### Issue 2: "Permission denied" (Docker)

**On Windows:**
```powershell
# Run Jenkins as Administrator
# Or add your user to docker-users group
net localgroup docker-users YourUsername /add
```

**On Linux:**
```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Issue 3: "Git not found"

**Solution:**
```powershell
# Install Git for Windows
# Download from: https://git-scm.com/download/win

# Or use Chocolatey
choco install git
```

### Issue 4: "npm command not found"

**Solution:**
```powershell
# Install Node.js
# Download from: https://nodejs.org

# Or use Chocolatey
choco install nodejs
```

### Issue 5: "Tests failing in Jenkins but pass locally"

**Common causes:**
- Environment variables missing
- Different Node/Python versions
- Database not accessible

**Solution:**
```groovy
// Add to Jenkinsfile environment section
environment {
    DATABASE_URL = 'postgresql://user:pass@localhost:5432/test_db'
    NODE_ENV = 'test'
}
```

### Issue 6: "Cannot connect to Docker daemon"

**Windows Solution:**
```powershell
# Start Docker Desktop
# Wait for Docker to fully start (whale icon in system tray)

# Test connection
docker ps
```

### Issue 7: "GitHub webhook not triggering build"

**Solution:**
1. Go to GitHub repository → Settings → Webhooks
2. Add webhook:
   - Payload URL: `http://your-jenkins-url:8080/github-webhook/`
   - Content type: `application/json`
   - Events: `Just the push event`
   - Active: ✅

### Issue 8: "Docker Hub push fails"

**Solution:**
```bash
# Verify credentials
docker login

# Check credential ID in Jenkinsfile matches Jenkins
# Should be: docker-hub-credentials

# Verify Docker Hub repository exists:
# https://hub.docker.com/repository/create
# Create: red445992/hirely-backend
# Create: red445992/hirely-frontend
```

---

## 9. Advanced Configuration

### Enable GitHub Webhook (Automatic Builds)

#### Step 1: Configure GitHub Webhook
1. Go to GitHub: `https://github.com/red445992/Hirely---Ai-powered-Job-portal`
2. Settings → Webhooks → Add webhook
3. Configure:
   ```
   Payload URL: http://your-jenkins-url:8080/github-webhook/
   Content type: application/json
   Secret: (leave empty or add shared secret)
   SSL verification: Enable (if using HTTPS)
   Events: Just the push event
   Active: ✅
   ```
4. Add webhook

#### Step 2: Test Webhook
1. Make a commit and push to GitHub
2. Jenkins should automatically start a build
3. Check webhook deliveries in GitHub

### Enable Email Notifications

#### Step 1: Configure Email in Jenkins
1. **Manage Jenkins → System**
2. Scroll to **Extended E-mail Notification**
3. Configure SMTP:
   ```
   SMTP server: smtp.gmail.com
   SMTP Port: 587
   ```
4. Add credentials:
   - Username: your-email@gmail.com
   - Password: App Password (not regular password)

#### Step 2: Uncomment Email in Jenkinsfile
```groovy
// In post section, uncomment emailext blocks
emailext (
    subject: "✅ SUCCESS: ${env.JOB_NAME}",
    body: "Build completed successfully",
    to: "your-email@example.com"
)
```

---

## 10. Best Practices

### 1. Secure Credentials
- ✅ Never commit credentials to Git
- ✅ Use Jenkins Credentials Store
- ✅ Use Docker Hub access tokens, not passwords
- ✅ Use GitHub Personal Access Tokens

### 2. Branch Strategy
```
main branch    → Production builds
QA branch      → Staging/Testing builds
dev branch     → Development builds
feature/*      → No auto-deploy
```

### 3. Build Optimization
- ✅ Use Docker layer caching
- ✅ Run tests in parallel when possible
- ✅ Cache npm/pip dependencies
- ✅ Clean workspace after build

### 4. Monitoring
- ✅ Enable build notifications (email/Slack)
- ✅ Monitor build times
- ✅ Archive test reports
- ✅ Track deployment history

---

## 11. Jenkins Pipeline Visualization

```
GitHub Push
     ↓
Jenkins Webhook Triggered
     ↓
┌─────────────────────────────────┐
│   Checkout Code from GitHub     │
└─────────────────────────────────┘
     ↓
┌─────────────────────────────────┐
│   Run Backend Tests (67 tests)  │
└─────────────────────────────────┘
     ↓
┌─────────────────────────────────┐
│  Run Frontend Tests (82 tests)  │
└─────────────────────────────────┘
     ↓
┌─────────────────────────────────┐
│   Build Docker Images           │
│   - Backend Image               │
│   - Frontend Image              │
└─────────────────────────────────┘
     ↓
┌─────────────────────────────────┐
│   Push Images to Docker Hub     │
└─────────────────────────────────┘
     ↓
┌─────────────────────────────────┐
│   Deploy with Docker Compose    │
└─────────────────────────────────┘
     ↓
┌─────────────────────────────────┐
│   Health Check                  │
└─────────────────────────────────┘
     ↓
   Success! 🎉
```

---

## 12. Quick Reference

### Jenkins URLs
```
Dashboard: http://localhost:8080
Jobs: http://localhost:8080/job/Hirely-CI-CD-Pipeline/
Credentials: http://localhost:8080/credentials/
Configuration: http://localhost:8080/configure
```

### Important Directories
```
Windows:
  Jenkins Home: C:\Program Files\Jenkins
  Workspace: C:\Program Files\Jenkins\workspace\Hirely-CI-CD-Pipeline

Linux:
  Jenkins Home: /var/lib/jenkins
  Workspace: /var/lib/jenkins/workspace/Hirely-CI-CD-Pipeline
```

### Useful Commands
```bash
# Restart Jenkins
# Windows: Restart-Service jenkins
# Linux: sudo systemctl restart jenkins

# View Jenkins logs
# Windows: C:\Program Files\Jenkins\jenkins.log
# Linux: sudo journalctl -u jenkins

# Check Jenkins status
# Windows: Get-Service jenkins
# Linux: sudo systemctl status jenkins
```

---

## 🎉 Success Checklist

- [ ] Jenkins installed and accessible at http://localhost:8080
- [ ] Required plugins installed (Docker, Git, NodeJS, GitHub)
- [ ] GitHub credentials configured
- [ ] Docker Hub credentials configured
- [ ] Pipeline job created: `Hirely-CI-CD-Pipeline`
- [ ] Jenkinsfile updated with correct repository URL
- [ ] First build runs successfully
- [ ] Tests pass (67 backend + 82 frontend)
- [ ] Docker images built and pushed to Docker Hub
- [ ] Application deployed and accessible
- [ ] Health check passes
- [ ] (Optional) GitHub webhook configured
- [ ] (Optional) Email notifications configured

---

## 📞 Support

If you encounter issues:
1. Check **Console Output** in Jenkins build
2. Review this guide's **Troubleshooting** section
3. Check Jenkins logs
4. Verify all prerequisites are installed
5. Ensure Docker Desktop is running

---

**Created:** November 25, 2025
**Last Updated:** November 25, 2025
**Version:** 1.0.0
