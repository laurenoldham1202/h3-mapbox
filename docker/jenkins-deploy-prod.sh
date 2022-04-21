#Purpose: deploy a docker stack to test|beta|prod
#Scope: all docker projects

#Variables Required from REPO:
#PROJECT_NAME eg PROJECT_NAME=is-speciesadmin
##REPLICAS 
#TAG

#Variables Required from User Input (Jenkins job config):
#UCPCREDS  Bindings->Secret ZIP file->Variable=UCPCREDS-->Credentials=[test|prod]-ucp-bundle-admin.zip
#job setting:  delete workspace after build (otherwise gpg won't overwrite file next time and you'll leave a decrypted key in workspace
#job setting: chmod +x ./docker/jenkins-deploy.sh
#job setting: sparse checkout path docker
#job setting: NO SPACES IN JOB NAME
#Execution Context: assumes repo/workspace is current directory and docker-compose.yml is in subdirectory docker

#Authorization: assumes credentials are cached on build server for dtr

#Notes: For development, substitute username in registry path, e.g. DTR=dtr.ornith.cornell.edu:5443/dac388/

set -euxo pipefail

# Export config variables set in .env file
set -a && source docker/prod.env && set +a

# Set Docker Datacenter environment credentials
cd ${UCPCREDS} && eval $(<env.sh) && cd "${WORKSPACE}"

docker stack deploy --compose-file docker/docker-compose.yml --with-registry-auth ${PROJECT_NAME}