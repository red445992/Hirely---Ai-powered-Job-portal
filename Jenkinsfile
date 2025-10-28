pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-username/esema-jobapplication.git'
            }
        }
        
        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t hirely-backend:test .'
                    sh 'docker run --rm hirely-backend:test python manage.py test'
                }
            }
        }
        
        stage('Test Frontend') {
            steps {
                dir('hirely-frontend') {
                    sh 'docker build -t hirely-frontend:test .'
                    sh 'docker run --rm hirely-frontend:test npm test -- --coverage --watchAll=false'
                }
            }
        }
        
        stage('Build and Push Images') {
            steps {
                script {
                    docker.build("your-dockerhub-username/hirely-backend:${env.BUILD_ID}")
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        docker.image("your-dockerhub-username/hirely-backend:${env.BUILD_ID}").push()
                    }
                    
                    docker.build("your-dockerhub-username/hirely-frontend:${env.BUILD_ID}")
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        docker.image("your-dockerhub-username/hirely-frontend:${env.BUILD_ID}").push()
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            emailext (
                subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: "The build ${env.BUILD_URL} completed successfully.",
                to: "dev-team@yourcompany.com"
            )
        }
        failure {
            emailext (
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: "The build ${env.BUILD_URL} failed.",
                to: "dev-team@yourcompany.com"
            )
        }
    }
}