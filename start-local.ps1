<#
start-local.ps1

Starts the server (server/src/index.js) and the frontend (Vite) in separate
PowerShell windows. Installs dependencies if `node_modules` are missing.

Usage: Right-click -> Run with PowerShell, or run: `./start-local.ps1`
#>

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Write-Host "Project root: $root"

# Start backend in new PowerShell window
$serverCmd = "Set-Location -LiteralPath '$root\server'; if (-Not (Test-Path 'node_modules')) { npm install }; npm run dev"
Write-Host "Starting backend: $serverCmd"
Start-Process -FilePath powershell -ArgumentList '-NoExit', '-Command', $serverCmd -WorkingDirectory "$root\server"

# Start frontend in new PowerShell window
$frontendCmd = "Set-Location -LiteralPath '$root'; if (-Not (Test-Path 'node_modules')) { npm install }; npm run dev"
Write-Host "Starting frontend: $frontendCmd"
Start-Process -FilePath powershell -ArgumentList '-NoExit', '-Command', $frontendCmd -WorkingDirectory $root

# Give servers a moment then open default browser to Vite dev URL
Start-Sleep -Seconds 3
try {
    Start-Process "http://localhost:5173"
}
catch {
    Write-Host "Could not open browser automatically. Visit http://localhost:5173"
}
