# Jenkins Quick Start Checklist

Follow these steps in order to get Jenkins running for your Hirely project.

## ⚡ Fast Track Setup (30 minutes)

### Part 1: Install Jenkins (10 mins)

#### Option A: Docker (Easiest - Recommended)
```powershell
# 1. Pull and run Jenkins
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts

# 2. Get initial password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# 3. Open browser
start http://localhost:8080
```

#### Option B: Windows Installer
```powershell
# 1. Download from https://www.jenkins.io/download/
# 2. Run the .msi installer
# 3. Open browser
start http://localhost:8080

# 4. Get password
Get-Content "C:\Program Files\Jenkins\secrets\initialAdminPassword"
```

---

### Part 2: Initial Configuration (10 mins)

#### Step 1: Unlock Jenkins
- [ ] Paste initial admin password
- [ ] Click **"Continue"**

#### Step 2: Install Plugins
- [ ] Click **"Install suggested plugins"**
- [ ] Wait for installation (5-10 minutes)

#### Step 3: Create Admin User
```
Username: admin
Password: [your-password]
Full Name: Admin
Email: your-email@example.com
```
- [ ] Click **"Save and Continue"**

#### Step 4: Configure Jenkins URL
- [ ] Keep default: `http://localhost:8080`
- [ ] Click **"Save and Finish"**
- [ ] Click **"Start using Jenkins"**

---

### Part 3: Install Required Plugins (5 mins)

1. [ ] Go to **Manage Jenkins → Plugins**
2. [ ] Click **"Available plugins"**
3. [ ] Search and install these plugins:

**Must Have:**
- [ ] Docker Pipeline
- [ ] Docker plugin
- [ ] GitHub Integration
- [ ] NodeJS plugin

**Optional:**
- [ ] Email Extension Plugin
- [ ] Slack Notification Plugin

4. [ ] Click **"Install without restart"**
5. [ ] Check **"Restart Jenkins when installation is complete"**

---

### Part 4: Configure Credentials (5 mins)

#### A. GitHub Credentials

1. **Create GitHub Personal Access Token:**
   - [ ] Go to GitHub → Settings → Developer settings
   - [ ] Personal access tokens → Tokens (classic)
   - [ ] Click **"Generate new token (classic)"**
   - [ ] Select scopes: `repo`, `admin:repo_hook`
   - [ ] Copy token

2. **Add to Jenkins:**
   - [ ] **Manage Jenkins → Credentials → (global) → Add Credentials**
   ```
   Kind: Username with password
   Username: red445992
   Password: [paste your GitHub token]
   ID: github-credentials
   Description: GitHub Access
   ```
   - [ ] Click **"Create"**

#### B. Docker Hub Credentials

1. **Get Docker Hub Token:**
   - [ ] Login to https://hub.docker.com
   - [ ] Account Settings → Security → New Access Token
   - [ ] Name: `Jenkins-CI`, Permissions: `Read, Write`
   - [ ] Copy token

2. **Add to Jenkins:**
   - [ ] **Manage Jenkins → Credentials → (global) → Add Credentials**
   ```
   Kind: Username with password
   Username: [your-docker-hub-username]
   Password: [paste your Docker Hub token]
   ID: docker-hub-credentials
   Description: Docker Hub Access
   ```
   - [ ] Click **"Create"**

---

### Part 5: Create Pipeline Job (5 mins)

1. [ ] Go to **Jenkins Dashboard**
2. [ ] Click **"New Item"**
3. [ ] Name: `Hirely-CI-CD-Pipeline`
4. [ ] Select **"Pipeline"**
5. [ ] Click **"OK"**

#### Configure Pipeline:

**General:**
- [ ] Description: `CI/CD Pipeline for Hirely Application`
- [ ] Check **"GitHub project"**
- [ ] URL: `https://github.com/red445992/Hirely---Ai-powered-Job-portal/`

**Build Triggers:**
- [ ] Check **"Poll SCM"**
- [ ] Schedule: `H/5 * * * *` (checks every 5 minutes)

**Pipeline:**
- [ ] Definition: **"Pipeline script from SCM"**
- [ ] SCM: **Git**
- [ ] Repository URL: `https://github.com/red445992/Hirely---Ai-powered-Job-portal.git`
- [ ] Credentials: **github-credentials**
- [ ] Branch: `*/QA` (or `*/main`)
- [ ] Script Path: `Jenkinsfile`

6. [ ] Click **"Save"**

---

### Part 6: First Build (5 mins)

1. [ ] Go to `Hirely-CI-CD-Pipeline` job
2. [ ] Click **"Build Now"**
3. [ ] Watch build in progress
4. [ ] Click build number (e.g., `#1`)
5. [ ] Click **"Console Output"**
6. [ ] Wait for build to complete

**Expected Stages:**
```
✓ Checkout Code
✓ Environment Setup
✓ Backend Tests (67 tests)
✓ Frontend Tests (82 tests)
✓ Build Backend Docker Image
✓ Build Frontend Docker Image
✓ Push Docker Images
✓ Deploy with Docker Compose
✓ Health Check
```

---

## ✅ Verification Checklist

After first build completes:

### Jenkins
- [ ] Build shows **SUCCESS** (blue ball)
- [ ] All stages completed successfully
- [ ] No error messages in console output

### Docker Hub
- [ ] Visit https://hub.docker.com/u/red445992
- [ ] Images visible:
  - [ ] `red445992/hirely-backend:latest`
  - [ ] `red445992/hirely-frontend:latest`

### Application
```powershell
# Check containers running
docker ps
# Should see: hirely_backend, hirely_frontend, hirely_postgres

# Test backend
curl http://localhost:8000/admin/

# Test frontend
curl http://localhost:3000/
```

- [ ] Backend accessible at http://localhost:8000
- [ ] Frontend accessible at http://localhost:3000
- [ ] No errors in docker logs

---

## 🔧 Common Issues & Quick Fixes

### Issue: "Docker not found"
```powershell
# Fix: Ensure Docker Desktop is running
docker --version
# If error, start Docker Desktop and wait for it to fully load
```

### Issue: "Tests failing"
```powershell
# Fix: Check if tests pass locally first
cd backend/HirelyBackend
python manage.py test

cd ../../hirely-frontend
npm run test:run
```

### Issue: "Cannot connect to GitHub"
```powershell
# Fix: Verify GitHub token has correct permissions
# Regenerate token with 'repo' scope
# Update credentials in Jenkins
```

### Issue: "Docker push denied"
```powershell
# Fix: Verify Docker Hub token
docker login
# Use token as password, not your regular password
# Update credentials in Jenkins
```

### Issue: "Port already in use"
```powershell
# Fix: Stop conflicting services
docker-compose down
# Or change ports in docker-compose.yml
```

---

## 📊 Build Time Expectations

| Stage | Expected Time |
|-------|--------------|
| Checkout | 10-30 seconds |
| Backend Tests | 30-60 seconds |
| Frontend Tests | 60-90 seconds |
| Docker Build | 2-5 minutes |
| Docker Push | 1-3 minutes |
| Deploy | 30-60 seconds |
| **Total** | **5-12 minutes** |

---

## 🎯 What's Next?

### 1. Enable Automatic Builds
- [ ] Set up GitHub webhook (see JENKINS_SETUP_GUIDE.md)
- [ ] Builds trigger automatically on push

### 2. Add More Branches
- [ ] Configure `main` branch for production
- [ ] Configure `dev` branch for development
- [ ] Different deployment targets per branch

### 3. Enable Notifications
- [ ] Configure email notifications
- [ ] Add Slack integration (optional)

### 4. Add More Stages
- [ ] Code quality analysis
- [ ] Security scanning
- [ ] Performance testing
- [ ] Deployment to cloud

---

## 📚 Documentation

- **Complete Guide**: `JENKINS_SETUP_GUIDE.md`
- **Jenkins File**: `Jenkinsfile`
- **Docker Setup**: `DOCKER_SETUP.md`
- **CI/CD Docs**: `CI_CD_DOCUMENTATION.md`

---

## 🆘 Need Help?

1. **Check Console Output** in Jenkins build
2. **Review Logs:**
   ```powershell
   # Jenkins logs
   docker logs jenkins
   
   # Application logs
   docker-compose logs
   ```
3. **Read Full Guide**: `JENKINS_SETUP_GUIDE.md`
4. **Check Prerequisites**: Java, Docker, Git, Node, Python

---

## 🎉 Success Criteria

You're done when:
- ✅ Jenkins accessible at http://localhost:8080
- ✅ Pipeline job created and configured
- ✅ First build completes successfully
- ✅ All 149 tests pass (67 + 82)
- ✅ Docker images pushed to Docker Hub
- ✅ Application running via docker-compose
- ✅ Backend accessible at http://localhost:8000
- ✅ Frontend accessible at http://localhost:3000

---

**Time to Complete:** ~30 minutes
**Difficulty:** Beginner-Friendly
**Last Updated:** November 25, 2025
