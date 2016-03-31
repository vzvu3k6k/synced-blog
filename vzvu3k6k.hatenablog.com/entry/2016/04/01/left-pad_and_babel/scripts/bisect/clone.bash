#!/bin/bash

for pkg in $(cat pkgs.txt);
do
    echo $pkg
    git clone $(curl "https://registry.npmjs.org/$pkg"| jq '.versions[.versions|keys|last].repository.url' | sed -e s/\"//g -e s/^git\+//) $pkg
done

git clone https://github.com/azer/format-date.git
git clone https://github.com/azer/prettify-error.git
