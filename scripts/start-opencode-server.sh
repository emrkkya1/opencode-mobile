#!/usr/bin/env bash
set -euo pipefail

echo "========================================"
echo "  OpenCode Mobile Server Launcher"
echo "========================================"
echo ""

echo -n "Are you going to use the app in the same Wi-Fi? (y/n): "
read -r same_wifi

case "$same_wifi" in
  [yY] | [yY][eE][sS])
    echo ""
    echo "Detecting LAN IP address..."
    LAN_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
    if [ -z "$LAN_IP" ]; then
      LAN_IP=$(ip -4 addr show scope global 2>/dev/null | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | head -1)
    fi
    if [ -z "$LAN_IP" ]; then
      echo "ERROR: Could not detect LAN IP address."
      echo "Please find your IP manually (ip addr) and run: opencode serve --host 0.0.0.0 --port 3000"
      exit 1
    fi

    SERVER_URL="http://${LAN_IP}:3000"
    echo "  Your LAN IP: ${LAN_IP}"
    echo "  Server URL:   ${SERVER_URL}"
    echo ""
    echo "On your phone, enter this URL in the app:"
    echo "  ${SERVER_URL}"
    echo ""
    echo "Starting opencode server on 0.0.0.0:3000 ..."
    echo "Press Ctrl+C to stop."
    echo ""
    exec opencode serve --host 0.0.0.0 --port 3000
    ;;

  [nN] | [nN][oO])
    echo ""
    TUNNEL_CMD=""

    if command -v cloudflared &>/dev/null; then
      echo "Found cloudflared."
      TUNNEL_CMD="cloudflared"
    elif command -v ngrok &>/dev/null; then
      echo "Found ngrok."
      TUNNEL_CMD="ngrok"
    else
      echo "No tunnel tool found. Install one of:"
      echo "  cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/"
      echo "  ngrok:       https://ngrok.com"
      echo ""
      echo "Falling back to LAN mode..."
      exec "$0" <<< "y"
    fi

    if [ "$TUNNEL_CMD" = "cloudflared" ]; then
      echo ""
      echo "Starting Cloudflare tunnel + opencode server..."
      echo "Look for the 'trycloudflare.com' URL in the cloudflared output."
      echo "Enter that URL in the app."
      echo "Press Ctrl+C to stop."
      echo ""
      cloudflared tunnel --url "http://localhost:3000" 2>&1 &
      CLOUDFLARED_PID=$!
      sleep 3
      opencode serve --host 127.0.0.1 --port 3000 &
      OPENCODE_PID=$!
      trap "kill $CLOUDFLARED_PID $OPENCODE_PID 2>/dev/null; exit 0" INT TERM
      wait
    elif [ "$TUNNEL_CMD" = "ngrok" ]; then
      echo ""
      echo "Starting ngrok tunnel + opencode server..."
      echo "Look for the 'ngrok-free.app' URL in the ngrok output."
      echo "Enter that URL in the app."
      echo "Press Ctrl+C to stop."
      echo ""
      ngrok http 3000 --log=stdout 2>&1 &
      NGROK_PID=$!
      sleep 3
      opencode serve --host 127.0.0.1 --port 3000 &
      OPENCODE_PID=$!
      trap "kill $NGROK_PID $OPENCODE_PID 2>/dev/null; exit 0" INT TERM
      wait
    fi
    ;;

  *)
    echo "Invalid answer. Please answer y/n."
    exec "$0"
    ;;
esac
