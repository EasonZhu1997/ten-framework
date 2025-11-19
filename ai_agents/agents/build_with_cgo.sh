#!/bin/bash
set -e

export LD_LIBRARY_PATH=/app/agents/ten_packages/system/ten_runtime/lib:/app/agents/ten_packages/system/ten_runtime_go/lib:\

# Compile all Go files together including cgo exports
cd /app/agents
go build -x -v \
  -ldflags " -L/app/agents/ten_packages/system/ten_runtime/lib -L/app/agents/ten_packages/system/ten_runtime_go/lib\
