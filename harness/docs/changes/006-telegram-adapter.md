# 006 — Telegram adapter

## Problem
Need chat access outside the web UI.

## Solution
Sidecar bot under `plugins/telegram-adapter` mapping Telegram chats/topics to DSH sessions.

## Verify
With `TELEGRAM_BOT_TOKEN` and `DSH_URL`, DM and group @mention reach the harness.
