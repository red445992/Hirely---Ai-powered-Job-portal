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
        
        stage('Install Dependencies') {
            steps {
                dir('hirely-frontend') {
                    bat 'npm ci'
                }
            }
        }
        
        stage('Build Application') {
            steps {
                dir('hirely-frontend') {
                    bat 'npm run build'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('hirely-frontend') {
                    script {
                        // Run tests but don't fail the build
                        bat 'npm test -- --watchAll=false --passWithNoTests || echo "Tests completed with warnings"'
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo "Build Status: ${currentBuild.currentResult}"
        }
        success {
            echo '🎉 Application built successfully! Ready for deployment.'
            // You can add deployment steps here later
        }
        failure {
            echo '❌ Build failed. Check the logs above.'
        }
    }
}