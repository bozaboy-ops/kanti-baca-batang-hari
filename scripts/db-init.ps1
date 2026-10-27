# BaccaAI D-drive PostgreSQL cluster init (port 5433). Idempotent.
$ErrorActionPreference = "Stop"
$PgBin = "C:\Program Files\PostgreSQL\17\bin"
$DataDir = "D:\bacca-ai\pgdata"
$Port = 5433
$LogFile = Join-Path $DataDir "server.log"

if (-not (Test-Path (Join-Path $DataDir "PG_VERSION"))) {
  Write-Host "initdb: creating cluster at $DataDir ..."
  & "$PgBin\initdb.exe" -D $DataDir -U bacca -A trust
  if ($LASTEXITCODE -ne 0) { throw "initdb failed with exit code $LASTEXITCODE" }
} else {
  Write-Host "initdb: cluster already exists at $DataDir, skipping."
}

& "$PgBin\pg_ctl.exe" -D $DataDir status *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host "pg_ctl: starting cluster on port $Port ..."
  & "$PgBin\pg_ctl.exe" -D $DataDir -o "-p $Port" -l $LogFile start
  if ($LASTEXITCODE -ne 0) { throw "pg_ctl start failed with exit code $LASTEXITCODE" }
} else {
  Write-Host "pg_ctl: cluster already running."
}

$exists = & "$PgBin\psql.exe" -h 127.0.0.1 -p $Port -U bacca -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = 'bacca_ai'"
if ($exists -ne "1") {
  Write-Host "createdb: creating database bacca_ai ..."
  & "$PgBin\createdb.exe" -h 127.0.0.1 -p $Port -U bacca bacca_ai
  if ($LASTEXITCODE -ne 0) { throw "createdb failed with exit code $LASTEXITCODE" }
} else {
  Write-Host "createdb: database bacca_ai already exists, skipping."
}
Write-Host "db-init OK: postgres://bacca@127.0.0.1:5433/bacca_ai"
