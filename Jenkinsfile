pipeline {
    agent any
    
    tools {
        nodejs 'nodejs' // Make sure you have Node.js installed in Jenkins
    }
    
    environment {
        // Add any environment variables you need
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
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
                    // Check if package.json exists and install dependencies
                    if (fileExists('package.json')) {
                        sh 'npm install'
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    // Build your React/Node.js application
                    if (fileExists('package.json')) {
                        sh 'npm run build'
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    // Run tests if available
                    if (fileExists('package.json')) {
                        try {
                            sh 'npm test'
                        } catch (e) {
                            echo 'Tests failed, but continuing pipeline'
                            // Uncomment the next line if you want to fail the build on test failures
                            // error('Tests failed')
                        }
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Add your deployment steps here
                    echo 'Deploying application...'
                    // Example: docker build, push to registry, deploy to server
                }
            }
        }
    }
    
    post {
        always {
            // Clean workspace after build
            cleanWs()
            
            // Send email notification
            emailext (
                subject: "Build Result: ${currentBuild.currentResult} - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                <p>Build: ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                <p>Status: ${currentBuild.currentResult}</p>
                <p>URL: ${env.BUILD_URL}</p>
                <p>Check the console output at <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
                """,
                to: "dev-team@yourcompany.com",
                attachLog: true
            )
        }
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}