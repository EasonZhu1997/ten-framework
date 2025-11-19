#!/bin/bash
# TEN Agent 服务启动脚本

echo "正在启动 TEN Agent 服务..."

# 停止旧服务
pkill -9 -f /app/server/bin/api 2>/dev/null || true
pkill -9 -f "tman designer" 2>/dev/null || true

# 等待进程完全停止
sleep 2

# 启动 API Server
echo "启动 API Server..."
cd /app && export AGORA_APP_ID='04fcd624adea4ceab56717ab22734138' && \
export AGORA_APP_CERTIFICATE='' && \
export SERVER_PORT=8080 && \
export LOG_PATH=/tmp/ten_agent && \
export LOG_STDOUT=true && \
export WORKERS_MAX=100 && \
export WORKER_QUIT_TIMEOUT_SECONDES=60 && \
/app/server/bin/api > /tmp/api.log 2>&1 &

sleep 2

# 启动 TMAN Designer
echo "启动 TMAN Designer..."
cd /app/agents && \
export TMAN_08_COMPATIBLE=true && \
tman designer > /tmp/tman.log 2>&1 &

sleep 3

# 检查服务状态
echo ""
echo "=== 服务状态 ==="
ps aux | grep -E 'bin/api|tman designer' | grep -v grep
echo ""
echo "✅ 服务已启动！"
echo "   API Server: http://localhost:8080"
echo "   TMAN Designer: http://localhost:49483"
echo "   Playground: http://localhost:3000"
echo ""
echo "请在浏览器中："
echo "1. 访问 http://localhost:3000"
echo "2. 按 Ctrl+Shift+Delete 清除浏览器缓存"
echo "3. 或按 Ctrl+Shift+R 强制刷新"
echo "4. 点击 Connect 按钮"
echo ""
