# Definir variables globales
$global:SHOW_LOGS      = $false
$global:CLEAN_INSTALL  = $false
$global:CONTAINER_NAME = "oracle-container"
$global:IMAGE_NAME     = "oracle-bot"

# Función para mostrar encabezado
function Header {
    Clear-Host
    Write-Host "──────────────────────────────────────────" -ForegroundColor Cyan
    Write-Host " 🚀 Spring Boot Docker Deploy Script " -ForegroundColor Cyan
    Write-Host "──────────────────────────────────────────" -ForegroundColor Cyan
}

# Función para mostrar errores y terminar el script
function Throw-Error {
    param(
        [string]$Message
    )
    Write-Host "✘ Error: $Message" -ForegroundColor Red
    exit 1
}

# Verificar variables de entorno en el archivo .env
function Check-Env {
    if (-not (Test-Path ".env")) {
        Throw-Error "Archivo .env no encontrado. Crea uno basado en .env.example"
    }

    $requiredVars = @("db_user", "dbpassword", "db_url")
    foreach ($var in $requiredVars) {
        if (-not (Select-String -Path ".env" -Pattern "^$var=" -Quiet)) {
            Throw-Error "Variable requerida $var no encontrada en .env"
        }
    }
    Write-Host "✔ Variables de entorno verificadas" -ForegroundColor Green
}

# Función de animación con contador de tiempo
function Animation {
    param(
        [string]$Msg,
        [System.Management.Automation.Job]$Job
    )
    $startTime = Get-Date
    $frames = @("⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏")
    Write-Host "$Msg..." -ForegroundColor Blue

    while ($Job.State -eq 'Running') {
        foreach ($frame in $frames) {
            if ($Job.State -ne 'Running') { break }
            $elapsed = (Get-Date) - $startTime
            $mins = [math]::Floor($elapsed.TotalSeconds / 60)
            $secs = [math]::Floor($elapsed.TotalSeconds % 60)
            Write-Host -NoNewline "`r$frame  $mins`: $secs" -ForegroundColor Yellow
            Start-Sleep -Milliseconds 100
        }
    }

    # Esperar a que el trabajo finalice y obtener el código de salida
    $null = Wait-Job $Job
    $jobResult = Receive-Job $Job -ErrorAction SilentlyContinue
    Remove-Job $Job

    # Se asume que si no hubo error, $LASTEXITCODE es 0
    # En PowerShell, Invoke-Expression lanza excepciones en errores,
    # por lo que si llegamos hasta aquí el comando se ejecutó correctamente.
    $totalTime = (Get-Date) - $startTime
    $totalMins = [math]::Floor($totalTime.TotalSeconds / 60)
    $totalSecs = [math]::Floor($totalTime.TotalSeconds % 60)
    Write-Host "`r✔ $Msg completado (Tiempo: ${totalMins}m ${totalSecs}s)" -ForegroundColor Green
}

# Función para ejecutar comandos (con o sin logs)
function Execute-Command {
    param(
        [string]$Cmd,
        [string]$Msg
    )
    if ($global:SHOW_LOGS) {
        Write-Host "Ejecutando: $Cmd" -ForegroundColor Blue
        $startTime = Get-Date
        try {
            Invoke-Expression $Cmd
        }
        catch {
            Throw-Error "$Msg falló"
        }
        $elapsed = (Get-Date) - $startTime
        $mins = [math]::Floor($elapsed.TotalSeconds / 60)
        $secs = [math]::Floor($elapsed.TotalSeconds % 60)
        Write-Host "✔ $Msg completado (Tiempo: ${mins}m ${secs}s)" -ForegroundColor Green
    }
    else {
        # Ejecutar el comando en segundo plano como trabajo
        $job = Start-Job -ScriptBlock { param($c) Invoke-Expression $c } -ArgumentList $Cmd
        Animation $Msg $job
    }
}

# Función para limpiar contenedor e imagen Docker
function Cleanup {
    Write-Host "Limpiando entorno Docker:" -ForegroundColor Yellow

    Execute-Command "docker stop `"$global:CONTAINER_NAME`" >\$null 2>&1" "Limpiando contenedor '$global:CONTAINER_NAME'"
    Execute-Command "docker rm -f `"$global:CONTAINER_NAME`" >\$null 2>&1" "Eliminando contenedor '$global:CONTAINER_NAME'"
    Execute-Command "docker rmi `"$global:IMAGE_NAME`" >\$null 2>&1" "Eliminando imagen '$global:IMAGE_NAME'"
}

# Función para limpiar el directorio target
function Clean-Target {
    if ($global:CLEAN_INSTALL) {
        Write-Host "Realizando limpieza completa:" -ForegroundColor Yellow
        Execute-Command "Remove-Item -Recurse -Force ./target" "Eliminando directorio ./target"
    }
}

# Función para compilar la aplicación y construir la imagen Docker
function Build {
    Write-Host "Compilando aplicación:" -ForegroundColor Yellow

    if ($global:CLEAN_INSTALL) {
        $mavenCmd = "mvn clean verify"
    }
    else {
        $mavenCmd = "mvn verify"
    }
    Execute-Command $mavenCmd "Compilando con Maven (🜨)"
    Execute-Command "docker build -f Dockerfile --platform linux/amd64 -t '$global:IMAGE_NAME' ." "Construyendo imagen Docker (🐳)"
}

# Función para desplegar el contenedor Docker
function Deploy {
    Write-Host "Desplegando aplicación:" -ForegroundColor Yellow
    Execute-Command "docker run --name '$global:CONTAINER_NAME' -p 8080:8080 --env-file .env -d '$global:IMAGE_NAME'" "Desplegando contenedor Docker"
}

# Función para mostrar la ayuda
function Show-Help {
    Write-Host "Uso:" -ForegroundColor Cyan
    Write-Host "  .\script.ps1 [opciones]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Opciones:" -ForegroundColor Cyan
    Write-Host "  -l, --logs       Mostrar logs detallados del proceso"
    Write-Host "  -c, --clean      Realizar instalación limpia (elimina ./target)"
    Write-Host "  -h, --help       Mostrar esta ayuda"
    exit 0
}

# Función para procesar argumentos de línea de comando
function Process-Args {
    param(
        [string[]]$ArgsList
    )
    foreach ($arg in $ArgsList) {
        switch ($arg) {
            "-l" { $global:SHOW_LOGS = $true }
            "--logs" { $global:SHOW_LOGS = $true }
            "-c" { $global:CLEAN_INSTALL = $true }
            "--clean" { $global:CLEAN_INSTALL = $true }
            "-h" { Show-Help }
            "--help" { Show-Help }
            default { Throw-Error "Opción desconocida: $arg" }
        }
    }
}

# Función para mostrar el banner final con información de tiempo
function Show-Final-Banner {
    param(
        [datetime]$StartTime
    )
    $endTime = Get-Date
    $total = $endTime - $StartTime
    $mins = [math]::Floor($total.TotalSeconds / 60)
    $secs = [math]::Floor($total.TotalSeconds % 60)
    Write-Host ""
    Write-Host "✔ Despliegue completado con éxito!" -ForegroundColor Green
    Write-Host "⏱️  Tiempo total de despliegue: ${mins}m ${secs}s" -ForegroundColor Cyan
    Write-Host "🔗 Prueba la aplicación en: http://localhost:8080" -ForegroundColor Cyan
}

# Función principal
function Main {
    $startTime = Get-Date
    Process-Args $args
    Header
    Check-Env
    Cleanup
    Clean-Target
    Build
    Deploy
    Show-Final-Banner $startTime
}

# Ejecutar la función principal pasando los argumentos del script
Main $args
