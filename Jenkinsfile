pipeline {
    agent any

    environment {
        TEST_IMAGE = 'shop-sphere-tests-image'
        CONTAINER_NAME = 'shop-sphere-tests-container'
    }

    stages {
        stage('Clone Shop-Sphere-Tests') {
            steps {
                git url: 'https://github.com/umer-5/Shop-Sphere-Tests.git', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build(env.TEST_IMAGE, '.')
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                script {
                    sh """
                    docker run --rm --name ${env.CONTAINER_NAME} \
                      ${env.TEST_IMAGE}
                    """
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    sh "docker rm -f ${env.CONTAINER_NAME} || true"
                }
            }
        }
    }

    post {
        always {
            echo '📦 Pipeline complete.'
        }
        success {
            echo '✅ Tests passed successfully.'
        }
        failure {
            echo '❌ One or more tests failed.'
        }
    }
}

