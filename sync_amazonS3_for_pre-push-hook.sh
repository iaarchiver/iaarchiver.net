#!/bin/bash

# sync_amazonS3_for_pre-push-hook.sh
# ----------------------------------
# make symlink or copy to .git/hooks/pre-push



### check s3cmd command
[[ $(which s3cmd) ]] \
	|| { echo "s3cmd not found"; exit 1; }

### check is in git-worktree
[[ $(git rev-parse --is-inside-work-tree) == "true" ]] \
	|| { echo "run inside git-worktree"; exit 1; }

### Allows us to read user input below, assigns stdin to keyboard
exec < /dev/tty

CFGOPT="$HOME/.config/.s3cfg"
BUCKET="s3://s3.iaarchiver.net/"
PROJECT="$(git rev-parse --show-toplevel)"
PRESCRIPT="cd $PROJECT/.grunt; grunt build"

echo "[pre-push hooks]: Sync to AmazonS3?"
echo "LOCAL:["$PROJECT"] -> REMOTE["$BUCKET"]"

read -p "(y/N) : " yn

if [[ "$yn" =~ ^[yY] ]];then
	### run $PRESCRIPT
	eval $PRESCRIPT || { echo "Error in PRESCRIPT"; exit 1; }
	
	### ignore invisible file/dir
	s3cmd sync \
		--config $CFGOPT \
		--rexclude="^(.*/)*\.+.*" \
		--recursive \
		--delete-removed \
		$PROJECT/* $BUCKET \
		&& echo "Synced." \
		|| echo "Sync failed."
else
	echo "not Synced."
	echo "You can sync manually: exec .git/hooks/pre-push"
fi

