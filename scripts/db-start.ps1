# BaccaAI D-drive PostgreSQL cluster start (port 5433). Idempotent.
$ErrorActionPreference = "Stop"
$PgBin = "C:\Program Files\PostgreSQL\17\bin"
$DataDir = "D:\bacca-ai\pgdata"
$Port = 5433
$LogFile = Join-Path $DataDir "server.log"

& "$PgBin\pg_ctl.exe" -D $DataDir status *> $null
if ($LASTEXITCODE -eq 0) {
  Write-Host "pg_ctl: cluster already running on port $Port."
  exit 0
}
& "$PgBin\pg_ctl.exe" -D $DataDir -o "-p $Port" -l $LogFile start
if ($LASTEXITCODE -ne 0) { throw "pg_ctl start failed with exit code $LASTEXITCODE" }
Write-Host "db-start OK: postgres://bacca@127.0.0.1:5433/bacca_ai"
