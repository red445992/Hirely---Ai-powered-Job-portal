pipeline {
    agent any
    
    tools {
        nodejs 'nodejs'
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        
        stage('Install & Build') {
            steps {
                script {
                    bat 'node --version'
                    bat 'npm --version'
                    
                    if (fileExists('package.json')) {
                        bat 'npm install'
                        bat 'npm run build'
                    } else {
                        echo 'No package.json found. Listing directory contents:'
                        bat 'dir'
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo "Build finished: ${currentBuild.currentResult}"
        }
                dir('hirely-frontend') {
                    if (fileExists('package.json')) {
                        bat 'npm install'
                        bat 'npm run build'