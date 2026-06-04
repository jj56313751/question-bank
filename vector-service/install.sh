#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

PYTHON="${PYTHON:-python3}"
if ! command -v "$PYTHON" >/dev/null 2>&1; then
  echo "未找到 python3，请先安装 Python 3.10+"
  exit 1
fi

"$PYTHON" --version

if [ ! -d ".venv" ]; then
  "$PYTHON" -m venv .venv
fi

.venv/bin/pip install -U pip
.venv/bin/pip install -r requirements.txt

echo "向量服务依赖安装完成。启动: pnpm vector:dev"
