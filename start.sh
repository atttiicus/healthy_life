#!/bin/bash
# 用法: bash start.sh [dev|prod]
# 默认 dev 模式

MODE=${1:-dev}

if [[ "$MODE" != "dev" && "$MODE" != "prod" ]]; then
  echo "Usage: bash start.sh [dev|prod]"
  echo ""
  echo "  dev   启动开发模式（backend nodemon + admin vite + app vite）"
  echo "  prod  生产模式（build 前端 + PM2 启动 backend）"
  exit 1
fi

# ─── 颜色 ────────────────────────────────────────────────────────────────────
R='\033[0m'
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BLUE='\033[0;34m'
RED='\033[0;31m'

ROOT="$(cd "$(dirname "$0")" && pwd)"

# ─── 工具函数 ─────────────────────────────────────────────────────────────────
log()    { echo -e "${BOLD}[start]${R}   $*"; }
s_log()  { echo -e "${CYAN}[server]${R}  $*"; }
ad_log() { echo -e "${MAGENTA}[admin]${R}   $*"; }
ap_log() { echo -e "${BLUE}[app]${R}     $*"; }

# 为进程输出每行加颜色前缀
prefix_log() {
  local prefix="$1" color="$2"
  while IFS= read -r line; do
    printf "${color}%-10s${R} %s\n" "$prefix" "$line"
  done
}

divider() {
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${R}"
}

# 检测 node_modules，缺失则自动安装
ensure_deps() {
  local dir=$1
  local pm=$2
  if [[ ! -d "$dir/node_modules" ]]; then
    echo -e "  ${YELLOW}→ Installing $(basename "$dir") dependencies...${R}"
    (cd "$dir" && $pm install)
  fi
}

# ─── DEV 模式 ─────────────────────────────────────────────────────────────────
if [[ "$MODE" == "dev" ]]; then

  divider
  log "${GREEN}${BOLD}DEV 模式${R} — 启动所有服务"
  divider
  echo ""

  ensure_deps "$ROOT/server" "pnpm"
  ensure_deps "$ROOT/admin"  "npm"
  ensure_deps "$ROOT/app"    "npm"

  echo ""

  # ① 先启动后端
  s_log "Starting backend (nodemon / ts-node)..."
  (cd "$ROOT/server" && NODE_ENV=development pnpm run dev 2>&1 | prefix_log "[server]" "$CYAN") &
  SERVER_PID=$!

  # ② 等待后端监听 :2233（最多 60 秒）
  s_log "等待后端在 ${CYAN}:2233${R} 就绪..."
  SERVER_READY=0
  for i in $(seq 1 60); do
    if (echo > /dev/tcp/localhost/2233) 2>/dev/null; then
      s_log "${GREEN}✓ 后端已就绪（约 ${i}s）${R}"
      SERVER_READY=1
      break
    fi
    sleep 1
  done
  if [[ $SERVER_READY -eq 0 ]]; then
    s_log "${YELLOW}⚠ 等待超时，继续启动前端（建议检查后端日志）${R}"
  fi

  echo ""

  # ③ 后端就绪后再启动中台和小程序
  ad_log "Starting admin (vite dev)..."
  (cd "$ROOT/admin"  && npm run dev 2>&1 | prefix_log "[admin]  " "$MAGENTA") &
  ADMIN_PID=$!

  ap_log "Starting app (uni-app h5 dev)..."
  (cd "$ROOT/app"    && npm run dev:h5 2>&1 | prefix_log "[app]   " "$BLUE") &
  APP_PID=$!

  divider
  echo -e " ${GREEN}${BOLD}DEV 服务已启动${R}"
  echo -e "  ${CYAN}Backend${R}   →  http://localhost:2233"
  echo -e "  ${MAGENTA}Admin${R}     →  http://localhost:5173"
  echo -e "  ${BLUE}App${R}       →  http://localhost:8080"
  echo -e "  ${YELLOW}Ctrl+C 停止所有服务${R}"
  divider
  echo ""

  # Ctrl+C / SIGTERM 时统一清理子进程
  cleanup() {
    echo ""
    log "${YELLOW}正在停止所有服务...${R}"
    kill "$SERVER_PID" "$ADMIN_PID" "$APP_PID" 2>/dev/null
    wait 2>/dev/null
    log "${GREEN}所有服务已停止。${R}"
    exit 0
  }
  trap cleanup SIGINT SIGTERM

  # 等待所有后台进程结束（或 Ctrl+C）
  wait

# ─── PROD 模式 ────────────────────────────────────────────────────────────────
elif [[ "$MODE" == "prod" ]]; then

  divider
  log "${GREEN}${BOLD}PROD 模式${R} — 构建并启动生产环境"
  divider
  echo ""

  ensure_deps "$ROOT/server" "pnpm"
  ensure_deps "$ROOT/admin"  "npm"
  ensure_deps "$ROOT/app"    "npm"

  echo ""

  # 构建 admin
  ad_log "${YELLOW}Building admin frontend...${R}"
  if (cd "$ROOT/admin" && npm run build); then
    ad_log "${GREEN}✓ Done → admin/dist/${R}"
  else
    ad_log "${RED}✗ Admin build failed.${R}"
    exit 1
  fi

  echo ""

  # 构建 app
  ap_log "${YELLOW}Building app frontend...${R}"
  if (cd "$ROOT/app" && npm run build:h5); then
    ap_log "${GREEN}✓ Done → app/dist/build/h5-uni/${R}"
  else
    ap_log "${RED}✗ App build failed.${R}"
    exit 1
  fi

  echo ""

  # 启动 backend（PM2）
  s_log "${YELLOW}Starting backend via PM2...${R}"
  if (cd "$ROOT/server" && NODE_ENV=production pnpm run prod); then
    s_log "${GREEN}✓ PM2 process started.${R}"
  else
    s_log "${RED}✗ Backend start failed.${R}"
    exit 1
  fi

  echo ""
  divider
  echo -e " ${GREEN}${BOLD}PROD 环境就绪${R}"
  echo -e "  ${CYAN}Backend${R}   →  PM2 运行中，端口 2233"
  echo -e "  ${MAGENTA}Admin${R}     →  admin/dist/         （部署到 Nginx）"
  echo -e "  ${BLUE}App${R}       →  app/dist/build/h5-uni/ （部署到 Nginx）"
  divider
  echo ""

fi
