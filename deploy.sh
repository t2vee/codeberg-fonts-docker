#!/bin/bash -ex

# This script is derived from deploy.sh in Codeberg Documentation by The Codeberg Documentation Contributors,
# under CC-BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/deed.en

npm run build


if [ ! -d pages.git ]; then
	mkdir pages.git && cd pages.git
	git init && git remote add origin "git@codeberg.org:codeberg-fonts/pages.git"
	cd ..
fi

rsync -av _site/* pages.git/

cd pages.git
git add -A
git commit -am "Deployment at $(date -u -Is)"
git push origin main -f
