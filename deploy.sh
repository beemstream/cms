#!/bin/bash

npm version minor

# Push bumped as docker tag
PACKAGE_VERSION=`node -p "require('./package.json').version"`
docker build -t beemstream/cms:$PACKAGE_VERSION .
docker push beemstream/cms:$PACKAGE_VERSION

# Tag image as latest
docker pull beemstream/cms:$PACKAGE_VERSION
docker tag beemstream/cms:$PACKAGE_VERSION beemstream/cms:latest
docker push beemstream/cms:latest

ssh root@157.245.43.172 "docker service update --image beemstream/cms beemstream_cms && docker container prune -f && docker image prune -a -f"
