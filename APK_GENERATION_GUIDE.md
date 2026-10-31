# [STANDALONE APK] Smart Attendance - Android APK Generation Guide

Smart Attendance is built as an **offline-first algorithmic PWA (Progressive Web App)** that can be installed directly onto any Android device without Google Play Store, OR compiled into a standalone `.apk` using Capacitor or PWABuilder.

---

## METHOD 01: Direct Web APK (Easiest - 1 Minute, Zero Tools Needed)
If you don't have Android Studio installed on your computer, you can generate a signed `.apk` directly in your browser:

1. Open **[PWABuilder.com](https://www.pwabuilder.com)**.
2. Host or serve your `smart-attendance` directory (or use GitHub Pages / Localhost tunnel like Ngrok / Cloudflare Tunnel).
3. Paste the URL into PWABuilder.
4. Click **"Package for Android"**.
5. PWABuilder will automatically compile a clean, signed `smart-attendance.apk` for you to download and install on any Android phone!

---

## METHOD 02: Build Standalone APK with Capacitor & Android Studio

If you want complete offline compilation locally:

### 1. Prerequisites
Ensure you have Node.js and Android Studio installed.

### 2. Initialize Capacitor in this folder
Run in the `smart-attendance` folder:

```bash
cd /Users/sohangowda/.gemini/antigravity/scratch/smart-attendance
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Smart Attendance" "com.smartattendance.app" --web-dir .
```

### 3. Add Android Platform
```bash
npx cap add android
```

### 4. Build and Export APK
```bash
# Copy web assets to Android
npx cap copy android

# Open Android Studio to build APK
npx cap open android
```
In Android Studio:
1. Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. Once finished, click **locate** to get `app-debug.apk`.
3. Transfer `app-debug.apk` to your phone or share via WhatsApp/Telegram and tap to install!

---

## METHOD 03: Instant "Add to Home Screen" (Zero RAM Usage)
1. Open `index.html` in Chrome on your Android device (or via local network IP `http://<your-ip>:8080`).
2. Tap the **"Add to Home"** prompt that pops up at the top, or tap the three dots **(⋮)** in Chrome and tap **"Install app"**.
3. It installs an app icon with the frosted glass design onto your home screen and runs in standalone full-screen mode completely offline!
