#!/usr/bin/env bash
# 使用 Python 3 虚拟环境启动向量服务（避免系统 python 指向 2.7）
set -e
cd "$(dirname "$0")"

if [ ! -d ".venv" ]; then
  echo "未找到 .venv，请先执行: pnpm vector:install"
  exit 1
fi

PORT="${VECTOR_PORT:-8001}"
HOST="${VECTOR_HOST:-0.0.0.0}"

if lsof -i ":${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "端口 ${PORT} 已被占用。可任选其一："
  echo "  1) 结束占用进程: lsof -i :${PORT} -sTCP:LISTEN  然后 kill <PID>"
  echo "  2) 换端口启动: VECTOR_PORT=8002 pnpm vector:dev"
  exit 1
fi

exec .venv/bin/python -m uvicorn main:app --host "$HOST" --port "$PORT"
