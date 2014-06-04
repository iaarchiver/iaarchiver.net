#!/bin/bash

SITEURL='http://iaarchiver.net'
DIR='html'

### if $DIR doesn't exist, exit
[[ -d $DIR ]] || { echo "setup failed."; exit 1; }

### download only remote-updated html-files
wget -r -np $SITEURL -N -nH -P $DIR
# delete -N if need to overwrite all

### replace a pattern(PTR) in all files of target(DIR)
PTR1='s/http:\/\/s3\.iaarchiver\.net/http:\/\/localhost\:3000/g'
PTR2='s/http:\/\/iaarchiver\.net//g'

find $DIR -type f -name "*" | while read file; do
	echo "replacing $file ... "
	sed -i '' -e $PTR1 "$file"
	sed -i '' -e $PTR2 "$file"
done

### generate symlink ./style & ./scripts
ABSDIR=$(cd $DIR; pwd)
ln -s "$ABSDIR/../../style" "$ABSDIR/"
ln -s "$ABSDIR/../../scripts" "$ABSDIR/"
