#!/usr/bin/env bash
set -u

if ! command -v adb >/dev/null 2>&1; then
  echo "adb was not found. Add Android SDK platform-tools to PATH." >&2
  exit 1
fi

echo "Waiting for an Android device..."
adb wait-for-device

echo "Starting Expo Android build and forwarding app logs below."
echo "--- React Native / Expo logs ---"

adb logcat -v color '*:S' ReactNativeJS:V ReactNative:V Expo:V AndroidRuntime:E &
logcat_pid=$!

cleanup() {
  kill "$logcat_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

npx expo run:android
