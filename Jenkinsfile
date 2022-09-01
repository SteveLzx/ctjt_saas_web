pipeline {
    options {
        buildDiscarder(logRotator(numToKeepStr: "7", artifactNumToKeepStr: "10", daysToKeepStr: "5"))
        timeout(time: 20, unit: "MINUTES")
        disableConcurrentBuilds()
    }

    agent {
        label "master"
    }

    environment {
        //手动设置变量
        SERVICE_NAME = "saas-web"
        BUCKET_NAME = "ctjt-saas-web"
        OSS_CONF_PATH = "/var/jenkins_home/ossconfig/osstechconfig"  //科技驾培"osstechconfig"; 泥王"ossnwconfig";
        //固定不变变量
        JENKINS_HOME_ON_HOST = "/docker_data/jenkins"
        WORKSPACE_ON_HOST = env.WORKSPACE.replace("/var/jenkins_home", env.JENKINS_HOME_ON_HOST)
        REGISTRY_HOST = "registry-vpc.cn-shenzhen.aliyuncs.com"
        IMAGE_NAME = "${env.REGISTRY_HOST}/szcttech/${env.SERVICE_NAME}"
        K8S_CONTEXT_PREFIX = "tech-"
        CI_PATH = "/var/jenkins_home/workspace/common-ci-procress/tech_frount"
    }

    stages {
        stage("pre-build") {
            steps {
                script {
                    sh "cp -a ${env.CI_PATH}/* ."
                    load "Jenkinsfile_dem/pre-build.jenkinsfile"
                }
            }
        }

        stage("build") {
            steps {
                script {
                    load "Jenkinsfile_dem/build.jenkinsfile"
                }
            }
        }

        stage("package") {
            steps {
                script {
                    echo "开始打包"
                    sh "chmod +x ./pack.sh && ./pack.sh"
                }
            }
        }

        stage("deploy") {
            steps {
                script {
                    echo "开始发布"       
                    sh "chmod +x ./deploy.sh && ./deploy.sh"
                }
            }
        }

        stage("upload") {
            steps {
                script {
                    echo "开始上传 OSS"                
                    sh "chmod +x ./upload.sh && ./upload.sh"
                }
            }
        }
    }
}