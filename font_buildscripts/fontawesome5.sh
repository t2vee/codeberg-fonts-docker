FA_SUBDIR=fontawesome-free-5.14.0-web

cd $FA_SUBDIR
rm sprites/brands.svg
rm -r svgs/brands
rm webfonts/fa-brands*
cd ..
mv $FA_SUBDIR/* .
rmdir $FA_SUBDIR