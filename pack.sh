#!/bin/bash

# ./pack.sh 1.0.1

version="$1"

if [ -z "$version" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi

sed -i "s/\"version\": \".*\"/\"version\": \"$version\"/" info.json
zip -r bob-deepseek-explainer.bobplugin info.json main.js icon.png