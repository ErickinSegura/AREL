#!/bin/bash

export IMAGE_NAME=todolistapp-springboot
export IMAGE_NAME_AI=arel-ai-service
export IMAGE_VERSION=0.1


if [ -z "$DOCKER_REGISTRY" ]; then
    export DOCKER_REGISTRY=$(state_get DOCKER_REGISTRY)
    echo "DOCKER_REGISTRY set."
fi
if [ -z "$DOCKER_REGISTRY" ]; then
    echo "Error: DOCKER_REGISTRY env variable needs to be set!"
    exit 1
fi

export IMAGE=${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_VERSION}
export IMAGE_AI=${DOCKER_REGISTRY}/${IMAGE_NAME_AI}:${IMAGE_VERSION}

source .env
mvn clean package spring-boot:repackage
docker build -f Dockerfile -t $IMAGE .
docker build -f ai-microservice/Dockerfile -t $IMAGE_AI ai-microservice

docker push $IMAGE
PUSH_IMAGE_STATUS=$?
docker push $IMAGE_AI
PUSH_IMAGE_AI_STATUS=$?

if [ $PUSH_IMAGE_STATUS -eq 0 ] && [ $PUSH_IMAGE_AI_STATUS -eq 0 ]; then
    docker rmi "$IMAGE" #local
    docker rmi "$IMAGE_AI"
fi
