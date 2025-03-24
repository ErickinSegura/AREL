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

CONTAINER_NAME="oracle-container"
IMAGE_NAME="oracle-bot"

# Variables globales
SHOW_LOGS=false
CLEAN_INSTALL=false

# Mostrar encabezado
header() {
  clear
  echo -e "${CYAN}${BOLD}"
  echo "──────────────────────────────────────────"
  echo " 🚀 Spring Boot Docker Deploy Script "
  echo "──────────────────────────────────────────"
  echo -e "${RESET}"
}

# Verificar variables de entorno
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
  
  echo -e "${GREEN}${CHECK} Variables de entorno verificadas${RESET}"
}

# Función para mostrar errores
error() {
  echo -e "\n${RED}${CROSS} Error: $1${RESET}"
  exit 1
}

# Animación con contador de tiempo
animation() {
  local msg="$1"
  local pid=$2
  local start_time=$(date +%s)
  
  # Frames de animación elegante y minimalista
  local frames=("⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏")
  
  echo -e "${BLUE}${msg}...${RESET}"
  
  while kill -0 $pid 2>/dev/null; do
    for frame in "${frames[@]}"; do
      # Calcular tiempo transcurrido
      local current_time=$(date +%s)
      local elapsed=$((current_time - start_time))
      local mins=$((elapsed / 60))
      local secs=$((elapsed % 60))
      
      # Mostrar la animación con tiempo transcurrido
      printf "\r${CYAN}${BOLD} ${frame} ${RESET}${YELLOW} %02d:%02d${RESET}" $mins $secs
      sleep 0.1
    done
  done
  
  # Verificar si el proceso terminó correctamente
  wait $pid
  local exit_status=$?
  
  # Calcular tiempo total
  local end_time=$(date +%s)
  local total=$((end_time - start_time))
  local total_mins=$((total / 60))
  local total_secs=$((total % 60))
  
  if [ $exit_status -eq 0 ]; then
    printf "\r${GREEN}${CHECK} ${msg} completado ${YELLOW}(Tiempo: ${total_mins}m ${total_secs}s)${RESET}\n"
  else
    printf "\r${RED}${CROSS} ${msg} falló ${YELLOW}(Tiempo: ${total_mins}m ${total_secs}s)${RESET}\n"
    exit 1
  fi
}

# Función para ejecutar comandos (con o sin logs)
execute_command() {
  local cmd="$1"
  local msg="$2"
  
  if [ "$SHOW_LOGS" = true ]; then
    echo -e "${BLUE}Ejecutando: ${BOLD}$cmd${RESET}"
    local start_time=$(date +%s)
    eval "$cmd" || error "$msg falló"
    local end_time=$(date +%s)
    local total=$((end_time - start_time))
    local mins=$((total / 60))
    local secs=$((total % 60))
    echo -e "${GREEN}${CHECK} $msg completado ${YELLOW}(Tiempo: ${mins}m ${secs}s)${RESET}"
  else
    # Ejecutar el comando en segundo plano y capturar su PID
    eval "$cmd" > /dev/null 2>&1 &
    local cmd_pid=$!
    
    # Mostrar la animación mientras el comando se ejecuta
    animation "$msg" $cmd_pid
  fi
}

# Limpiar contenedor e imagen
cleanup() {
  echo -e "${YELLOW}${BOLD}Limpiando entorno Docker:${RESET}"
  
  execute_command "docker stop \"${CONTAINER_NAME}\" > /dev/null 2>&1 || true" "Limpiando contenedor '${CONTAINER_NAME}'"
  execute_command "docker rm -f \"${CONTAINER_NAME}\" > /dev/null 2>&1 || true" "Eliminando contenedor '${CONTAINER_NAME}'"
  execute_command "docker rmi \"${IMAGE_NAME}\" > /dev/null 2>&1 || true" "Eliminando imagen '${IMAGE_NAME}'"
}

# Limpiar directorio target
clean_target() {
  if [ "$CLEAN_INSTALL" = true ]; then
    echo -e "${YELLOW}${BOLD}Realizando limpieza completa:${RESET}"
    execute_command "rm -rf ./target" "Eliminando directorio ./target"
  fi
}

# Compilar y construir imagen
build() {
  echo -e "${YELLOW}${BOLD}Compilando aplicación:${RESET}"
  
  local maven_cmd="mvn verify"
  if [ "$CLEAN_INSTALL" = true ]; then
    maven_cmd="mvn clean verify"
  fi
  
  execute_command "$maven_cmd" "Compilando con Maven (${MAVEN_ICON})"
  execute_command "docker build -f Dockerfile --platform linux/amd64 -t '${IMAGE_NAME}' ." "Construyendo imagen Docker (${DOCKER_ICON})"
}

# Desplegar contenedor
deploy() {
  echo -e "${YELLOW}${BOLD}Desplegando aplicación:${RESET}"
  
  execute_command "docker run --name '${CONTAINER_NAME}' -p 8080:8080 --env-file .env -d '${IMAGE_NAME}'" "Desplegando contenedor Docker"
}

# Mostrar ayuda
show_help() {
  echo -e "${CYAN}${BOLD}Uso:${RESET}"
  echo -e "  $0 [opciones]"
  echo
  echo -e "${CYAN}${BOLD}Opciones:${RESET}"
  echo -e "  -l, --logs       Mostrar logs detallados del proceso"
  echo -e "  -c, --clean      Realizar instalación limpia (elimina ./target)"
  echo -e "  -h, --help       Mostrar esta ayuda"
  echo
  exit 0
}

# Procesar argumentos
process_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      -l|--logs)
        SHOW_LOGS=true
        shift
        ;;
      -c|--clean)
        CLEAN_INSTALL=true
        shift
        ;;
      -h|--help)
        show_help
        ;;
      *)
        error "Opción desconocida: $1"
        ;;
    esac
  done
}

# Banner final elegante
show_final_banner() {
  local start_time=$1
  local end_time=$(date +%s)
  local total_time=$((end_time - start_time))
  local mins=$((total_time / 60))
  local secs=$((total_time % 60))
  
  echo -e "\n${GREEN}${BOLD}${CHECK} Despliegue completado con éxito!${RESET}"
  echo -e "${CYAN}⏱️  Tiempo total de despliegue: ${YELLOW}${mins}m ${secs}s${RESET}"
  echo -e "${CYAN}🔗 Prueba la aplicación en: ${BOLD}http://localhost:8080${RESET}\n"
  echo -e "${RESET}"
}

# Flujo principal
main() {
  local start_time=$(date +%s)
  process_args "$@"
  header
  check_env
  cleanup
  clean_target
  build
  deploy
  show_final_banner $start_time
}

# Ejecutar el script pasando todos los argumentos
main "$@"