#!/bin/sh
# Sync local html-files for live-reload

SITEURL='http://iaarchiver.net'
DIR='html'

# if $DIR doesn't exist, exit
[[ -d $DIR ]] || exit

# download html-files to $DIR
wget -r -np $SITEURL -N -nH -P $DIR

# generate symlink ./style & ./scripts
ABSDIR=$(cd $DIR && pwd)
ln -s "$ABSDIR/../../style" "$ABSDIR/" 
ln -s "$ABSDIR/../../scripts" "$ABSDIR/" 
