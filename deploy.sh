#!/bin/bash -ex

# This script is derived from deploy.sh in Codeberg Documentation by The Codeberg Documentation Contributors,
# under CC-BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/deed.en

DEPLOYMENT_REPO=${1:-git@codeberg.org:Codeberg-Infrastructure/static-deployments}
DEPLOYMENT_BRANCH=${2:-fonts}

npm run build
rm -rf pages.git
mkdir pages.git
( cd pages.git && git init -b "$DEPLOYMENT_BRANCH" )
rsync -av _site/* pages.git/
echo "$DEPLOYMENT_BRANCH.codeberg.org" > pages.git/.domains
( cd pages.git && git add -A )				## add all generated files
( cd pages.git && git commit -m "Deployment at $(date -u -Is)" )	## commit all
( cd pages.git && git remote add origin "$DEPLOYMENT_REPO" )
# ( cd pages.git && git push -f origin "$DEPLOYMENT_BRANCH" )		## force-push and rewrite (empty) history
