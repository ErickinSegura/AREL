#!/bin/bash

# Script para monitorear logs de oracle-container en tiempo real
# Creado: 13/04/2025
# Actualizado: 17/04/2025

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
    echo -e "${YELLOW}   MONITOR DE LOGS - AREL CONTAINER   ${NC}"
    echo -e "${BLUE}=========================================${NC}"
    echo ""
}

# Función para verificar si el contenedor existe
verificar_contenedor() {
    while ! docker ps -a | grep -q "arel-container"; do
        echo -e "${YELLOW}[ESPERANDO] El contenedor 'arel-container' no existe.${NC}"
        echo -e "${YELLOW}[INFO] Esperando 1 segundo antes de volver a verificar...${NC}"
        sleep 1
        mostrar_banner
    done
    echo -e "${GREEN}[OK] Contenedor 'arel-container' encontrado.${NC}"
}

# Función para verificar si el contenedor está corriendo
verificar_estado() {
    while ! docker ps | grep -q "arel-container"; do
        echo -e "${YELLOW}[ESPERANDO] El contenedor 'arel-container' existe pero no está en ejecución.${NC}"
        echo -e "${YELLOW}[INFO] Esperando 1 segundos antes de volver a verificar...${NC}"
        sleep 1
        mostrar_banner
        # Verificamos de nuevo si el contenedor existe (por si fue eliminado mientras esperábamos)
        if ! docker ps -a | grep -q "arel-container"; then
            return
        fi
    done
    echo -e "${GREEN}[OK] El contenedor 'arel-container' está en ejecución.${NC}"
}

# Función para monitorear logs
monitorear_logs() {
    echo -e "${GREEN}Monitoreando logs en tiempo real (presiona Ctrl+C para salir)...${NC}"
    echo ""

    # Intentamos monitorear logs, si falla volvemos al inicio
    if ! docker logs --tail=50 --follow arel-container; then
        echo -e "${RED}[ERROR] No se pudieron obtener los logs. El contenedor podría haberse detenido.${NC}"
        echo -e "${YELLOW}[INFO] Reiniciando monitoreo en 1 segundo...${NC}"
        sleep 1
    fi
}

# Función principal
main() {
    while true; do
        mostrar_banner
        verificar_contenedor
        verificar_estado
        monitorear_logs
    done
}

# Ejecutar función principal
main