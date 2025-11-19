#!/bin/bash
# 快速启动 TEN Agent 椿子聊天系统

echo "========================================="
echo "   启动椿子语音助手"
echo "========================================="
echo ""

cd /app

# 1. 停止旧服务
echo "[1/4] 停止旧服务..."
pkill -9 -f /app/server/bin/api 2>/dev/null || true
pkill -9 -f "tman designer" 2>/dev/null || true
pkill -9 -f worker 2>/dev/null || true
sleep 2

# 2. 启动 API Server
echo "[2/4] 启动 API Server..."
export AGORA_APP_ID='b7d66c3f555443bebfdf3691d68d9561'
export AGORA_APP_CERTIFICATE='bbff338517254c21b45cb46db3337b2b'
export SERVER_PORT=8080
export LOG_PATH=/tmp/ten_agent
export LOG_STDOUT=true
export WORKERS_MAX=100
export WORKER_QUIT_TIMEOUT_SECONDES=60

/app/server/bin/api > /tmp/api.log 2>&1 &
sleep 3

# 3. 启动 TMAN Designer
echo "[3/4] 启动 TMAN Designer..."
cd /app/agents
export TMAN_08_COMPATIBLE=true
tman designer > /tmp/tman.log 2>&1 &
sleep 3

# 4. 检查服务状态
echo "[4/4] 检查服务状态..."
ps aux | grep -E 'bin/api|tman designer' | grep -v grep

echo ""
echo "========================================="
echo "✅ 椿子已准备好！"
echo "========================================="
echo ""
echo "📱 访问地址："
echo "   Playground: http://localhost:3000"
echo "   TMAN Designer: http://localhost:49483"
echo ""
echo "🎯 使用步骤："
echo "   1. 打开浏览器访问 Playground"
echo "   2. 按 Ctrl+Shift+R 强制刷新"
echo "   3. 选择 chunzi_voice_assistant"
echo "   4. 点击 Connect"
echo "   5. 开始与椿子对话！"
echo ""
echo "🔑 已配置的 API Keys:"
echo "   - Agora APP ID: ✅"
echo "   - DeepSeek API (LLM): ✅"
echo "   - Fish Audio TTS: ✅"
echo ""
