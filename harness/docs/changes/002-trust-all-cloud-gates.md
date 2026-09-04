# 002 — Trust-all cloud gates

## Problem
Stock DSH web treats non-loopback clients as restricted (`isLoopbackHostname`, `isTrustedApiRequest`). Public Railway/Render URLs break settings and privileged APIs.

## Solution
Runtime patch forces both gates true; startup disables loopback-only host bind warning. Anyone with the URL is fully trusted (no auth layer by product choice).

## Verify
Remote browser can change settings, use host tools, and call `/api` without 403.
