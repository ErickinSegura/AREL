[CmdletBinding()]
param (
    [switch]$Logs,
    [switch]$Clean,
    [switch]$Help
)

# Spring Boot Docker Deploy PowerShell Script
# Equivalent translation from the bash script

# Configuración global
$ErrorActionPreference = "Stop"

# Variables para colores y símbolos
$RESET = "$([char]27)[0m"
$BOLD = "$([char]27)[1m"
$BLUE = "$([char]27)[34m"
$GREEN = "$([char]27)[32m"
$YELLOW = "$([char]27)[33m"
$RED = "$([char]27)[31m"
$CYAN = "$([char]27)[36m"

$CHECK = "✔"
$CROSS = "✘"
$DOCKER_ICON = "🐳"
$MAVEN_ICON = "🜨"

$CONTAINER_NAME = "arel-container"
$IMAGE_NAME = "arel-bot"
$NETWORK_NAME = "arel-net"

# Variables globales
$SHOW_LOGS = $false
$CLEAN_INSTALL = $false

# Mostrar encabezado
function Show-Header {
    Clear-Host
    Write-Host "$CYAN$BOLD"
    Write-Host "──────────────────────────────────────────"
    Write-Host " 🚀 Spring Boot Docker Deploy Script "
    Write-Host "──────────────────────────────────────────"
    Write-Host "$RESET"
}

# Verificar variables de entorno
function Test-Environment {
    if (-not (Test-Path -Path ".env")) {
        Show-Error "Archivo .env no encontrado. Crea uno basado en .env.example"
    }

    $envContent = Get-Content -Path ".env" -ErrorAction SilentlyContinue
    $requiredVars = @("db_user", "dbpassword", "db_url")

    foreach ($var in $requiredVars) {
        if (-not ($envContent -match "^$var=")) {
            Show-Error "Variable requerida $var no encontrada en .env"
        }
    }

    Write-Host "$GREEN$CHECK Variables de entorno verificadas$RESET"
}

# Función para mostrar errores
function Show-Error {
    param (
        [string]$message
    )

    Write-Host "`n$RED$CROSS Error: $message$RESET"
    exit 1
}

# Animación con contador de tiempo
function Show-Animation {
    param (
        [string]$message,
        [System.Diagnostics.Process]$process
    )

    $frames = @("⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏")
    $startTime = Get-Date

    Write-Host "$BLUE$message...$RESET"

    $frameIndex = 0
    while (-not $process.HasExited) {
        $currentTime = Get-Date
        $elapsed = ($currentTime - $startTime).TotalSeconds
        $mins = [math]::Floor($elapsed / 60)
        $secs = [math]::Floor($elapsed % 60)

        $frame = $frames[$frameIndex % $frames.Count]
        # Fixed formatting
        $timeDisplay = "{0:00}:{1:00}" -f $mins, $secs
        Write-Host "`r$CYAN$BOLD $frame $RESET$YELLOW $timeDisplay$RESET" -NoNewline

        $frameIndex++
        Start-Sleep -Milliseconds 100
    }

    # Verificar si el proceso terminó correctamente
    $exitStatus = $process.ExitCode

    # Calcular tiempo total
    $endTime = Get-Date
    $totalTime = ($endTime - $startTime).TotalSeconds
    $totalMins = [math]::Floor($totalTime / 60)
    $totalSecs = [math]::Floor($totalTime % 60)

    if ($exitStatus -eq 0) {
        Write-Host "`r$GREEN$CHECK $message completado $YELLOW(Tiempo: ${totalMins}m ${totalSecs}s)$RESET"
    } else {
        Write-Host "`r$RED$CROSS $message falló $YELLOW(Tiempo: ${totalMins}m ${totalSecs}s)$RESET"
        exit 1
    }
}

# Función para ejecutar comandos (con o sin logs)
function Invoke-CommandWithFeedback {
    param (
        [string]$command,
        [string]$message
    )

    if ($SHOW_LOGS) {
        Write-Host "$BLUE`Ejecutando: $BOLD$command$RESET"
        $startTime = Get-Date

        try {
            Invoke-Expression $command
            if ($LASTEXITCODE -ne 0) {
                Show-Error "$message falló con código de salida $LASTEXITCODE"
            }
        }
        catch {
            Show-Error "$message falló: $_"
        }

        $endTime = Get-Date
        $totalTime = ($endTime - $startTime).TotalSeconds
        $mins = [math]::Floor($totalTime / 60)
        $secs = [math]::Floor($totalTime % 60)

        Write-Host "$GREEN$CHECK $message completado $YELLOW(Tiempo: ${mins}m ${secs}s)$RESET"
    }
    else {
        # Special handling for Maven and Docker commands
        if ($message -like "*Maven*" -or $message -like "*Docker*") {
            Write-Host "$BLUE`Ejecutando: $BOLD$command$RESET"
            $startTime = Get-Date

            try {
                $processOutput = Invoke-Expression $command 2>&1
                if ($LASTEXITCODE -ne 0) {
                    Write-Host "`n$RED$BOLD`Error durante la ejecución de '$message':$RESET"
                    Write-Host "$RED$processOutput$RESET"
                    Show-Error "$message falló con código de salida $LASTEXITCODE"
                }
            }
            catch {
                Show-Error "$message falló: $_"
            }

            $endTime = Get-Date
            $totalTime = ($endTime - $startTime).TotalSeconds
            $mins = [math]::Floor($totalTime / 60)
            $secs = [math]::Floor($totalTime % 60)

            Write-Host "$GREEN$CHECK $message completado $YELLOW(Tiempo: ${mins}m ${secs}s)$RESET"
        }
        else {
            # For other commands, use the previous method with async processing
            $processInfo = New-Object System.Diagnostics.ProcessStartInfo
            $processInfo.FileName = "powershell.exe"
            $processInfo.Arguments = "-Command $command"
            $processInfo.RedirectStandardError = $true
            $processInfo.RedirectStandardOutput = $true
            $processInfo.UseShellExecute = $false
            $processInfo.CreateNoWindow = $true

            $process = New-Object System.Diagnostics.Process
            $process.StartInfo = $processInfo
            $process.Start() | Out-Null

            # Capture standard output and error
            $stdout = $process.StandardOutput.ReadToEndAsync()
            $stderr = $process.StandardError.ReadToEndAsync()

            # Show animation while the command runs
            Show-Animation $message $process

            # Check for errors
            if ($process.ExitCode -ne 0) {
                $errorOutput = $stderr.Result
                Write-Host "`n$RED$BOLD`Error durante la ejecución de '$message':$RESET"
                if ($errorOutput) {
                    Write-Host "$RED$errorOutput$RESET"
                }
                Show-Error "$message falló con código de salida $($process.ExitCode)"
            }
        }
    }
}

# Crear o verificar red Docker
function Test-DockerNetwork {
    Write-Host "$YELLOW$BOLD`Verificando red Docker:$RESET"

    $networkExists = docker network ls --format "{{.Name}}" | Select-String -Pattern "^$NETWORK_NAME$" -Quiet

    if (-not $networkExists) {
        Write-Host "Creando la red $NETWORK_NAME..."
        Invoke-CommandWithFeedback "docker network create $NETWORK_NAME" "Creando red Docker '$NETWORK_NAME'"
    } else {
        Write-Host "$GREEN$CHECK Red '$NETWORK_NAME' ya existe$RESET"
    }
}

# Limpiar contenedor e imagen
function Invoke-Cleanup {
    Write-Host "$YELLOW$BOLD`Limpiando entorno Docker:$RESET"

    Invoke-CommandWithFeedback "if (docker ps -a --format '{{.Names}}' | Select-String -Pattern '$CONTAINER_NAME') { docker stop '$CONTAINER_NAME' }" "Limpiando contenedor '$CONTAINER_NAME'"
    Invoke-CommandWithFeedback "if (docker ps -a --format '{{.Names}}' | Select-String -Pattern '$CONTAINER_NAME') { docker rm -f '$CONTAINER_NAME' }" "Eliminando contenedor '$CONTAINER_NAME'"
    Invoke-CommandWithFeedback "if (docker images --format '{{.Repository}}' | Select-String -Pattern '$IMAGE_NAME') { docker rmi '$IMAGE_NAME' }" "Eliminando imagen '$IMAGE_NAME'"
}

# Limpiar directorio target
function Clear-Target {
    if ($CLEAN_INSTALL) {
        Write-Host "$YELLOW$BOLD`Realizando limpieza completa:$RESET"
        Invoke-CommandWithFeedback "if (Test-Path -Path './target') { Remove-Item -Recurse -Force './target' }" "Eliminando directorio ./target"
    }
}

function Invoke-Build {
    Write-Host "$YELLOW$BOLD`Compilando aplicación:$RESET"

    # Check if Maven wrapper exists
    if (-not (Test-Path -Path ".\mvnw")) {
        Show-Error "Maven wrapper (mvnw) no encontrado. ¿Estás en el directorio correcto del proyecto?"
    }

    $mavenCmd = ".\mvnw verify"
    if ($CLEAN_INSTALL) {
        $mavenCmd = ".\mvnw clean verify"
    }

    Invoke-CommandWithFeedback $mavenCmd "Compilando con Maven (${MAVEN_ICON})"
    Invoke-CommandWithFeedback "docker build -f Dockerfile --platform linux/amd64 -t '$IMAGE_NAME' ." "Construyendo imagen Docker (${DOCKER_ICON})"
}

# Desplegar contenedor
function Invoke-Deploy {
    Write-Host "$YELLOW$BOLD`Desplegando aplicación:$RESET"

    Invoke-CommandWithFeedback "docker run --name '$CONTAINER_NAME' --network $NETWORK_NAME -p 8080:8080 --env-file .env -d '$IMAGE_NAME'" "Desplegando contenedor Docker"
}

# Mostrar ayuda
function Show-Help {
    Write-Host "$CYAN$BOLD`Uso:$RESET"
    Write-Host "  .\init.ps1 [opciones]"
    Write-Host ""
    Write-Host "$CYAN$BOLD`Opciones:$RESET"
    Write-Host "  -Logs        Mostrar logs detallados del proceso"
    Write-Host "  -Clean       Realizar instalación limpia (elimina ./target)"
    Write-Host "  -Help        Mostrar esta ayuda"
    Write-Host ""
    exit 0
}

# Banner final elegante
function Show-FinalBanner {
    param (
        [DateTime]$startTime
    )

    $endTime = Get-Date
    $totalTime = ($endTime - $startTime).TotalSeconds
    $mins = [math]::Floor($totalTime / 60)
    $secs = [math]::Floor($totalTime % 60)

    Write-Host "`n$GREEN$BOLD$CHECK Despliegue completado con éxito!$RESET"
    Write-Host "$CYAN⏱️  Tiempo total de despliegue: $YELLOW$($mins)m $($secs)s$RESET"
    Write-Host "$CYAN🔗 Prueba la aplicación en: $BOLD`http://localhost:8080$RESET`n"
}

# Flujo principal
function Invoke-Main {
    param (
        [switch]$Logs,
        [switch]$Clean,
        [switch]$Help
    )

    if ($Help) {
        Show-Help
    }

    $SHOW_LOGS = $Logs
    $CLEAN_INSTALL = $Clean

    $startTime = Get-Date
    Show-Header
    Test-Environment
    Invoke-Cleanup
    Clear-Target
    Invoke-Build
    Test-DockerNetwork
    Invoke-Deploy
    Show-FinalBanner $startTime
}

# Ejecutar el script con los parámetros proporcionados
Invoke-Main -Logs:$Logs -Clean:$Clean -Help:$Help