#Purpose: build and push a docker image
#Scope: all projects except: Springboot (docker integration plugin is used to build and push)

#Variables Required from REPO:
#PROJECT_NAME e.g. PROJECT_NAME=is-speciesadmin  
#DTR e.g. DTR=dtr.ornith.cornell.edu:5443/clo/

#Variables Required from User Input (Jenkins Build Parameter):
#BUILD_VERSION e.g. set jenkins to parameterize build
#note, BUILD_VERSION replaces TAG here, so you can manually pick the tag of the image you're building
#job setting: chmod +x ./docker/jenkins-build-push.sh
#job setting: build on commit, slack notification to dept on failure
#job setting: General: this project is parameterized, String Parameter: Name: BUILD_VERSION

#Execution Context: assumes repo/workspace is current directory and Dockerfile is in subdirectory docker

#Authorization: assumes credentials are cached on build server for dtr

#Notes: For development, substitute username in registry path, e.g. DTR=dtr.ornith.cornell.edu:5443/dac388/

#build image from each dockerfile and name it the service name

set -euxo pipefail

# Export config variables set in .env file
set -a && source docker/test.env && set +a

docker build -t ${PROJECT_NAME} .
docker tag  ${PROJECT_NAME} ${DTR}${PROJECT_NAME}:${BUILD_VERSION}
docker push ${DTR}${PROJECT_NAME}:${BUILD_VERSION}