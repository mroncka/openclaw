<#
.SYNOPSIS
OpenClaw Gateway Watcher - Simple, reliable version
.DESCRIPTION
Watches for local code changes and restarts the gateway.
Logs available via: openclaw logs gateway
#>

param()

$WatchPaths = @('src', 'dist', '.openclaw')
$DebounceMs = 1200

Write-Host "`n=== OpenClaw Gateway Watcher ===" -ForegroundColor Green
Write-Host "Watching: $($WatchPaths -join ', ')"
Write-Host "Logs: openclaw logs gateway`n"
Write-Host "Ctrl-C to stop`n"

$gatewayProc = $null
$changeDetected = $false

function Start-Gateway {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Starting gateway..." -ForegroundColor Cyan
    # Run pnpm via PowerShell since it's not a direct exe
    $proc = Start-Process -FilePath powershell.exe -ArgumentList @('-NoProfile', '-Command', 'pnpm openclaw gateway run --bind lan --port 18789 --force') `
        -WindowStyle Hidden -PassThru
    if ($proc) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Started (PID $($proc.Id))" -ForegroundColor Green
    }
    return $proc
}

function Stop-Gateway {
    if ($script:gatewayProc -and -not $script:gatewayProc.HasExited) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Stopping gateway..." -ForegroundColor Yellow
        try { $script:gatewayProc.Kill() } catch { }
        try { $script:gatewayProc.WaitForExit(3000) } catch { }
    }
}

$script:gatewayProc = Start-Gateway

# Setup FileSystemWatchers
$watchers = @()
foreach ($watchPath in $WatchPaths) {
    if (-not (Test-Path $watchPath)) { continue }
    $fullPath = (Resolve-Path $watchPath).Path
    $fsw = New-Object System.IO.FileSystemWatcher
    $fsw.Path = $fullPath
    $fsw.IncludeSubdirectories = $true
    $fsw.NotifyFilter = [System.IO.NotifyFilters]('FileName', 'DirectoryName', 'LastWrite')
    $fsw.Filter = '*.*'
    
    $onFileChange = { $script:changeDetected = $true }
    $fsw.add_Changed($onFileChange)
    $fsw.add_Created($onFileChange)
    $fsw.add_Deleted($onFileChange)
    $fsw.add_Renamed($onFileChange)
    $fsw.EnableRaisingEvents = $true
    $watchers += $fsw
}

Write-Host "Ready. Waiting for changes...`n"

$onExit = {
    Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] Exiting..." -ForegroundColor Yellow
    foreach ($w in $watchers) { try { $w.Dispose() } catch { } }
    Stop-Gateway
    Write-Host "Done`n" -ForegroundColor Green
    exit 0
}

$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { & $onExit } -ErrorAction SilentlyContinue

$running = $true
$lastChange = [DateTime]::Now

try {
    while ($running) {
        if ($changeDetected -and ([DateTime]::Now - $lastChange).TotalMilliseconds -ge $DebounceMs) {
            $script:changeDetected = $false
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Detected changes. Building..." -ForegroundColor Magenta
            pnpm build 2>$null | Out-Null
            Stop-Gateway
            Start-Sleep -Milliseconds 300
            $script:gatewayProc = Start-Gateway
            $lastChange = [DateTime]::Now
        }
        
        if ($script:gatewayProc -and $script:gatewayProc.HasExited) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Gateway crashed. Restarting..." -ForegroundColor Yellow
            $script:gatewayProc = Start-Gateway
        }
        
        Start-Sleep -Milliseconds 250
    }
} finally {
    & $onExit
}
