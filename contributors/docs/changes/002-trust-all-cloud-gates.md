# 002 — Trust-all cloud gates

## Problem
Stock DSH web treats non-loopback clients as restricted. Public cloud URLs break settings and privileged APIs.

## Solution
Runtime patch forces `isLoopbackHostname` and `isTrustedApiRequest` true (see `harness/custom/scripts/apply-trust-all-patch.js`).

## Verify
Remote browser can use full settings and `/api` without 403.
