#!/usr/bin/env bash
# ==============================================================================
# SMART ATTENDANCE — LOCAL HOST & ANDROID INSTALL LAUNCHER
# Developer: Sohan Gowda & AI Pair | Swiss Typographic Edition
# ==============================================================================

PORT=8080
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")

echo "================================================================="
echo "  SMART ATTENDANCE SYSTEM 2.4 — LOCAL LAUNCHER & ANDROID INSTALL"
echo "================================================================="
echo ""
echo "1. ON THIS COMPUTER:"
echo "   Open your browser to: http://localhost:$PORT"
echo ""
echo "2. ON YOUR ANDROID PHONE (SAME WI-FI):"
echo "   Open Google Chrome and navigate to:"
echo ""
echo "   >>>  http://$IP:$PORT  <<<"
echo ""
echo "3. TO INSTALL AS STANDALONE ANDROID APK (Zero Tools Needed):"
echo "   - In Chrome on your phone, tap the prompt: 'Add to Home screen' or"
echo "   - Tap the three dots (⋮) in Chrome > 'Install app' / 'Add to Home screen'."
echo "   - Android OS automatically creates and installs a real standalone WebAPK"
echo "     with the frosted glass monogram icon and full offline capability!"
echo ""
echo "4. TO BUILD NATIVE FLUTTER APK LOCALLY:"
echo "   cd flutter_app && flutter build apk --release"
echo "   (Output: flutter_app/build/app/outputs/flutter-apk/app-release.apk)"
echo ""
echo "Starting local server on port $PORT (Press CTRL+C to stop)..."
echo "================================================================="
python3 -m http.server $PORT
