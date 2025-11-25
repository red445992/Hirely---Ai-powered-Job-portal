pipeline {
    agent any

    tools {
        // Make sure you have a NodeJS tool named 'nodejs' configured in Jenkins (Manage Jenkins → Global Tool Configuration)
        nodejs 'nodejs'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir('hirely-frontend') {
                    script {
                        bat 'node --version'
                        bat 'npm --version'

                        // Install deps and build the Next.js app
                        bat 'npm ci'
                        bat 'npm run lint:check'
                        bat 'npm run type-check'
                        bat 'npm run test:run'
                        bat 'npm run build'
                    }
                }
            }
        }
    }
}
