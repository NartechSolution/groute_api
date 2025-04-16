// pipeline {
//     agent any

//     environment {
//         ENV_FILE_PATH = "C:\\ProgramData\\Jenkins\\.jenkins\\jenkinsEnv\\nartechBackend"
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 checkout scmGit(
//                     branches: [
//                         [name: '*/main'],
//                         [name: '*/faysal']
//                     ], 
//                     extensions: [], 
//                     userRemoteConfigs: [[
//                         credentialsId: 'dev_majid_new_github_credentials', 
//                         url: 'https://github.com/NartechSolution/nartech-website-backend.git'
//                     ]]
//                 )
//             }
//         }

//         stage('Setup Environment File') {
//             steps {
//                 echo "Copying environment file to the backend..."
//                 bat "copy \"${ENV_FILE_PATH}\" \"%WORKSPACE%\\.env\""
//             }
//         }

//         stage('Manage PM2 and Install Dependencies') {
//             steps {
//                 script {
//                     echo "Stopping PM2 process if running..."
//                     def processStatus = bat(script: 'pm2 list', returnStdout: true).trim()
//                     if (processStatus.contains('nartechBackend')) {
//                         bat 'pm2 stop nartechBackend || exit 0'
//                         bat 'pm2 stop nartechWorkers || exit 0'
//                         bat 'pm2 delete nartechBackend || exit 0'
//                         bat 'pm2 delete nartechWorkers || exit 0'
//                         echo "PM2 process stopped and deleted."
//                     }
//                 }
//                 echo "Installing dependencies for Nartech Backend..."
//                 bat 'npm install'
//                 echo "Generating Prisma files..."
//                 bat 'npx prisma generate'
//                 echo "Restarting PM2 process..."
//                 bat 'pm2 start src/server.js --name nartechBackend'
//                 echo "Starting Nartech Workers..."
//                 bat 'pm2 start src/radis/workers/index.js --name nartechWorkers'
//                 echo "PM2 process started."
//                 bat 'pm2 save'
//                 echo "PM2 process saved."
//             }
//         }
//     }
// }
