#!/bin/bash
set -e

# Estilos
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
RESET=$(tput sgr0)
CHECK="✔"

CONTAINER_NAME="arel-ai-container"
IMAGE_NAME="arel-ai"

echo "${YELLOW}🔄 Limpiando contenedores antiguos...${RESET}"
docker stop "${CONTAINER_NAME}" >/dev/null 2>&1 || true
docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
docker rmi "${IMAGE_NAME}" >/dev/null 2>&1 || true

echo "${YELLOW}🐳 Construyendo imagen Docker...${RESET}"
docker build -t "${IMAGE_NAME}" ./ai-microservice

if ! docker network inspect arel-net > /dev/null 2>&1; then
  echo "Creando la red arel-net..."
  docker network create arel-net
  else
    echo "Red arel-net ya existe."
fi

echo "${YELLOW}🚀 Ejecutando contenedor...${RESET}"
docker run --name "${CONTAINER_NAME}" --network arel-net --env-file .env -p 5050:8080 -d "${IMAGE_NAME}"

echo "${GREEN}${CHECK} Contenedor Python desplegado exitosamente.${RESET}"
