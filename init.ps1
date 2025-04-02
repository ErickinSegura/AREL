# Guardar este contenido en un archivo, por ejemplo: deploy.ps1

# Función para mostrar el encabezado
function Show-Header {
    Clear-Host
    Write-Host "──────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host "   🚀 Spring Boot Docker Deploy Script   " -ForegroundColor Cyan
    Write-Host "──────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host ""
}

# Función para mostrar errores y salir
function Show-Error {
    param([string]$Message)
    Write-Host "✘ Error: $Message" -ForegroundColor Red
    exit 1
}

# Función para verificar el archivo .env y variables requeridas
function Check-Env {
    if (-Not (Test-Path ".env")) {
        Show-Error ".env no encontrado. Crea uno basado en .env.example"
    }

    $requiredVars = @("db_user", "dbpassword", "db_url")
    $envContent = Get-Content ".env"

    foreach ($var in $requiredVars) {
        if (-Not ($envContent -match "^$var=")) {
            Show-Error "Variable requerida '$var' no encontrada en .env"
        }
    }
}

# Función para mostrar un spinner (barra de progreso simulada)
function Show-Spinner {
    param(
        [string]$Message,
        [scriptblock]$Command
    )
    Write-Host "$Message..." -ForegroundColor Blue
    $total = 10
    for ($i = 0; $i -le $total; $i++) {
        $bar = ("█" * $i).PadRight($total)
        $percent = $i * 10
        Write-Host -NoNewline ("`r [$bar] $percent%")
        Start-Sleep -Milliseconds 200
    }
    Write-Host ""
    try {
        & $Command *>$null
        Write-Host "✔" -ForegroundColor Green
    }
    catch {
        Show-Error "$Message falló"
    }
}

# Función para limpiar contenedores e imágenes Docker
function Cleanup {
    $containerName = "arel-container"
    $imageName = "arel-bot"

    Write-Host "Limpiando contenedor '$containerName'..." -ForegroundColor Yellow
    docker stop $containerName *>$null
    docker rm -f $containerName *>$null
    Write-Host "✔" -ForegroundColor Green

    Write-Host "Limpiando imagen '$imageName'..." -ForegroundColor Yellow
    docker rmi $imageName *>$null
    Write-Host "✔" -ForegroundColor Green
}

# Función para compilar la aplicación y construir la imagen Docker
function Build {
    $mavenIcon = "🜨"
    $dockerIcon = "🐳"

    Show-Spinner "Compilando con Maven ($mavenIcon)" { .\mvnw verify }
    Show-Spinner "Construyendo imagen Docker ($dockerIcon)" { docker build -f Dockerfile --platform linux/amd64 -t "arel-bot" . }
}

# Función para desplegar el contenedor Docker
function Deploy {
    $containerName = "arel-container"
    $imageName = "arel-bot"

    Show-Spinner "Desplegando contenedor Docker" { docker run --name $containerName -p 8080:8080 --env-file .env -d $imageName }
}

# Función principal
function Main {
    Show-Header
    Check-Env
    Cleanup
    Build
    Deploy

    Write-Host ""
    Write-Host "✔ Despliegue completado con éxito!" -ForegroundColor Green
    Write-Host "🔗 Prueba la aplicación en: http://localhost:8080" -ForegroundColor Cyan
}

# Ejecutar la función principal
Main

