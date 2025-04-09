#!/bin/bash

set -e

echo "🚀 Iniciando migración de frontend-vite a frontend..."

# Backup por seguridad
echo "📦 Haciendo respaldo de frontend en frontend-backup"
cp -r frontend frontend-backup

# Eliminar contenido viejo de frontend (excepto archivos ocultos y carpetas que usaremos)
echo "🧹 Limpiando contenido viejo de frontend"
rm -rf frontend/src frontend/public frontend/node_modules frontend/package.json frontend/package-lock.json frontend/postcss.config.* frontend/index.html

# Mover contenido de frontend-vite a frontend
echo "📁 Moviendo archivos de frontend-vite a frontend"
shopt -s dotglob # Para incluir archivos ocultos como .eslintrc
mv frontend/frontend-vite/* frontend/
mv frontend/frontend-vite/.* frontend/ 2>/dev/null || true
shopt -u dotglob

# Eliminar carpeta frontend-vite
echo "🗑️ Eliminando carpeta frontend-vite"
rm -rf frontend/frontend-vite

# Ir a frontend e instalar dependencias
echo "📦 Instalando dependencias en frontend"
cd frontend
npm install

echo "✅ Migración completa. Puedes correr 'npm run dev' desde frontend/"