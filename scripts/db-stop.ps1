# BaccaAI D-drive PostgreSQL cluster stop. Idempotent.
$ErrorActionPreference = "Stop"
$PgBin = "C:\Program Files\PostgreSQL\17\bin"
$DataDir = "D:\bacca-ai\pgdata"

& "$PgBin\pg_ctl.exe" -D $DataDir status *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host "pg_ctl: cluster is not running, nothing to stop."
  exit 0
}
& "$PgBin\pg_ctl.exe" -D $DataDir stop -m fast
if ($LASTEXITCODE -ne 0) { throw "pg_ctl stop failed with exit code $LASTEXITCODE" }
Write-Host "db-stop OK."
