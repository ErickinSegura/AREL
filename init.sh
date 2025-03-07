#!/bin/bash
set -e

# Configuración de colores y estilos
BOLD=$(tput bold)
RESET=$(tput sgr0)
BLUE=$(tput setaf 4)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
RED=$(tput setaf 1)
CYAN=$(tput setaf 6)

CHECK="✔"
CROSS="✘"
DOCKER_ICON="🐳"
MAVEN_ICON="🜨"

CONTAINER_NAME="arel-container"
IMAGE_NAME="arel-bot"

# Dibujar encabezado
header() {
  clear
  echo -e "${CYAN}${BOLD}"
  echo "──────────────────────────────────────────"
  echo "   🚀 Spring Boot Docker Deploy Script   "
  echo "──────────────────────────────────────────"
  echo -e "${RESET}"
}

# Añade al principio del script
check_env() {
  if [ ! -f .env ]; then
    error "Archivo .env no encontrado. Crea uno basado en .env.example"
  fi

  required_vars=("db_user" "dbpassword" "db_url")
  for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env; then
      error "Variable requerida $var no encontrada en .env"
    fi
  done
}

# Modifica el main
main() {
  header
  check_env  # <-- Añade esta línea
  cleanup
  build
  deploy
  echo -e "\n${GREEN}${BOLD}${CHECK} Despliegue completado con éxito!${RESET}"
  echo -e "${CYAN}🔗 Prueba la aplicación en: ${BOLD}http://localhost:8080${RESET}\n"
}

# Función para mostrar errores
error() {
  echo -e "\n${RED}${CROSS} Error: $1${RESET}"
  exit 1
}

# Spinner moderno con barra de progreso
spinner() {
  local msg="$1"
  local cmd="$2"
  local total=10

  echo -ne "${BLUE}${msg}...${RESET}\n"
  for ((i = 0; i <= total; i++)); do
    printf "\r${BLUE} [%-${total}s] %d%%${RESET}" "$(printf '█%.0s' $(seq 1 $i))" "$((i * 10))"
    sleep 0.2
  done

  eval "$cmd" > /dev/null 2>&1 && echo -e " ${GREEN}${CHECK}${RESET}" || error "$msg falló"
}

# Limpiar contenedor e imagen
cleanup() {
  echo -ne "${YELLOW}Limpiando contenedor '${CONTAINER_NAME}'...${RESET}"
  docker stop "${CONTAINER_NAME}" > /dev/null 2>&1 || true
  docker rm -f "${CONTAINER_NAME}" > /dev/null 2>&1 || true
  echo -e " ${GREEN}${CHECK}${RESET}"

  echo -ne "${YELLOW}Limpiando imagen '${IMAGE_NAME}'...${RESET}"
  docker rmi "${IMAGE_NAME}" > /dev/null 2>&1 || true
  echo -e " ${GREEN}${CHECK}${RESET}"
}

# Compilar y construir imagen
build() {
  spinner "Compilando con Maven (${MAVEN_ICON})" "mvn verify"
  spinner "Construyendo imagen Docker (${DOCKER_ICON})" "docker build -f Dockerfile --platform linux/amd64 -t '${IMAGE_NAME}' ."
}

# Desplegar contenedor
deploy() {
  spinner "Desplegando contenedor Docker" "docker run --name '${CONTAINER_NAME}' -p 8080:8080 --env-file .env -d '${IMAGE_NAME}'"
}

# Flujo principal
main() {
  header
  check_env
  cleanup
  build
  deploy
  echo -e "\n${GREEN}${BOLD}${CHECK} Despliegue completado con éxito!${RESET}"
  echo -e "${CYAN}🔗 Prueba la aplicación en: ${BOLD}http://localhost:8080${RESET}\n"
}

main