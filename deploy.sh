#!/bin/bash -ex

# This script is derived from deploy.sh in Codeberg Documentation by The Codeberg Documentation Contributors,
# under CC-BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/deed.en

npm run build


if [ ! -d pages.git ]; then
    git clone git@codeberg.org:codeberg-fonts/pages.git pages.git
fi

rsync -av _site/* pages.git/

cd pages.git
git add -A
git commit -am "deployment"
git push origin main