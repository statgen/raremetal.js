#!/bin/bash
run_version() {
  exec npm version $1 -m 'Version %s';
}

case $1 in 
  patch|minor|major|prepatch|preminor|premajor|prerelease|from-git) run_version $1;;
  *) echo Must specify one of patch, minor, major, etc.;;
esac
