#!/bin/bash

# Script para monitorear logs de oracle-container en tiempo real
# Creado: 13/04/2025

# Colores para mejor visualización
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para mostrar banner
mostrar_banner() {
    clear
    echo -e "${BLUE}=========================================${NC}"
    echo -e "${YELLOW}   MONITOR DE LOGS - ORACLE CONTAINER   ${NC}"
    echo -e "${BLUE}=========================================${NC}"
    echo ""
}

# Función para verificar si el contenedor existe
verificar_contenedor() {
    if ! docker ps -a | grep -q "oracle-container"; then
        echo -e "${RED}[ERROR] El contenedor 'oracle-container' no existe.${NC}"
        exit 1
    fi
}

# Función para verificar si el contenedor está corriendo
verificar_estado() {
    if ! docker ps | grep -q "oracle-container"; then
        echo -e "${YELLOW}[AVISO] El contenedor 'oracle-container' no está en ejecución.${NC}"
        echo -e "${YELLOW}[AVISO] Solo se mostrarán logs históricos.${NC}"
    else
        echo -e "${GREEN}[OK] El contenedor 'oracle-container' está en ejecución.${NC}"
    fi
}

# Función para monitorear logs
monitorear_logs() {
    echo -e "${GREEN}Monitoreando logs en tiempo real (presiona Ctrl+C para salir)...${NC}"
    echo ""
    docker logs --tail=50 --follow oracle-container
}

# Función principal
main() {
    mostrar_banner
    verificar_contenedor
    verificar_estado
    monitorear_logs
}

# Ejecutar función principal
main