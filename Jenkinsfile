pipeline {
    agent any
    
    tools {
        nodejs 'nodejs'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    if (fileExists('package.json')) {
                        sh 'npm install'
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    if (fileExists('package.json')) {
                        sh 'npm run build'
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo "Build completed: ${currentBuild.currentResult}"
            // Remove email for now until configured
            // emailext ... 
        }
    }
}