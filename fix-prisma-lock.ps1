# PowerShell script to kill node processes and delete .prisma client directory safely

# Kill all node processes
Write-Host "Killing all node.exe processes..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait a moment to ensure processes are terminated
Start-Sleep -Seconds 2

# Delete the .prisma client directory
$prismaClientPath = "node_modules\.prisma\client"
if (Test-Path $prismaClientPath) {
    Write-Host "Deleting $prismaClientPath directory..."
    Remove-Item -Recurse -Force $prismaClientPath
    Write-Host "Deleted $prismaClientPath successfully."
} else {
    Write-Host "$prismaClientPath does not exist."
}

# Run prisma generate
Write-Host "Running 'npx prisma generate'..."
npx prisma generate
