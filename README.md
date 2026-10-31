# Smart Attendance — Clean Modern Edition
### Calm, Minimalist Student Attendance Tracker & Timetable Companion

Smart Attendance (Clean Modern Edition) is an effortless, friendly attendance tracker designed with **modern minimalism** (inspired by Apple, Linear, and Notion). It replaces dense engineering grids with **calm visual breathing room, friendly human language, soft rounded cards, and satisfying one-tap attendance logging**—while keeping 100% of the robust offline algorithms and privacy guarantees.

---

## What Makes This Edition Different?

- **Visual Breathing Room:** Soft rounded cards (16px), gentle shadows, airy layout, and clear typographic hierarchy.
- **Hero Attendance Ring:** A large, friendly circular percentage gauge showing your current standing at a glance (e.g. `84%`) with an instant answer to *"Can I bunk today?"*.
- **Thumb-Friendly One-Tap Action Cards:** Big, comfortable class cards for today's lectures with satisfying **Present** (green), **Absent** (coral red), and **No Class** (neutral) pill buttons.
- **Friendly Student Language:** Instead of complex jargon, you get clear advice: *"You're safe! 2 bunks available"* or *"Heads up! Attend next 2 classes to stay above 75%"*.
- **Seamless 4-Tab Navigation:** Today, Schedule, Courses, Calendar, Scanner, and Settings.
- **100% Offline & Private:** Zero backend server, zero tracking. All your data stays directly on your phone.

---

## Core Features

1. **Today's Classes:** Mark classes attended or missed with a single tap. Tapping again unmarks accidental taps with zero penalty.
2. **Weekly Schedule (Timetable):** Manage class periods, timings, rooms, and professors. Includes automatic time overlap detection.
3. **Course Registry:** Color-coded course cards with exact attended/conducted counts, percentages, and safe bunk limits.
4. **Calendar & Phone Sync (.ics):** Interactive monthly grid with 1-click export of your weekly timetable into Google Calendar or Apple Calendar with automated 10-minute alarms.
5. **Optical Timetable Scanner (OCR):** Snap a photo of your printed schedule and let the optical engine populate your timetable automatically.
6. **Smart Deficit Warnings:** Automatic reminders before class if your attendance is slipping below target.
7. **Day Conquered Celebration:** Uplifting motivational appreciation modal when you complete 100% of your daily lectures.
8. **Bug & Idea Reporting:** Integrated feedback form delivering diagnostic reports directly to the developer via Formspree.

---

## How to Install on Android

### Method 01: Instant 1-Click Install via GitHub Pages *(Recommended)*

1. Open the live link on your Android device in Google Chrome:
   ```text
   https://nigamon859-oss.github.io/smart-attendance-clean/
   ```
2. Tap the **"Install App"** prompt that pops up (or tap the 3 dots **⋮** > **"Install app"** / **"Add to Home screen"**).
3. Android compiles and installs a standalone **WebAPK** onto your home screen with the custom frosted glass `SA` icon.
4. It launches full-screen and runs **100% offline** anytime with ultra-low RAM usage.

### Method 02: Standalone Downloadable `.apk` *(Share via WhatsApp)*

1. Paste `https://nigamon859-oss.github.io/smart-attendance-clean/` into **[PWABuilder.com](https://www.pwabuilder.com)**.
2. Click **"Package for Android"** to download the signed `.apk`.
3. Send the `.apk` directly to your friends to tap and install.

### Method 03: Native Flutter App

Compile the native Android app using Flutter:
```bash
cd flutter_app
flutter build apk --release
```

---

## Developer & License

- **Developer:** Sohan Gowda & Antigravity AI Pair
- **Design Philosophy:** Calm Modern Minimalism (Nordic / Apple / Linear)
- **Version:** 2.4.0-clean
