#!/bin/sh
# setup 
#
#

# 
SITEURL='http://iaarchiver.net'
DIR='html'

wget -r -np $SITEURL -N -nH -P $DIR

if [[ ! -d $DIR]];then
	exit
fi

# replace a pattern(PTR) in all files of target(DIR)
PTR1='s/http:\/\/s3\.iaarchiver\.net//g'
PTR2='s/http:\/\/iaarchiver\.net//g'
PTR3='s/<head>/<head><base href=\"http:\/\/localhost:9000\/">/g'
PTR4='s/<\/body>/<script src=\"http:\/\/localhost:35729\/livereload.js\"><\/script><\/body>/g'

IFS='
'
cd $DIR
find . -type f -name "*" | while read file; do
	echo "replacing $file ..."
	sed -e $PTR1 "$file" > "$file.tmp0"
	sed -e $PTR2 "$file.tmp0" > "$file.tmp1"
	sed -e $PTR3 "$file.tmp1" > "$file.tmp0"
	sed -e $PTR4 "$file.tmp0" > "$file"
	rm "$file.tmp0"
	rm "$file.tmp1"
done
cd ..

# generate symlink html/index.html to ../index.html
ABSDIR=$(cd $DIR && pwd)
ln -s "$ABSDIR/../../style" "$ABSDIR/" 
ln -s "$ABSDIR/../../scripts" "$ABSDIR/" 
