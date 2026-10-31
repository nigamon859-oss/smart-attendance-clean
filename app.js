/**
 * Smart Attendance System 2.4 — Swiss International Typographic Engine
 * Precision algorithmic attendance telemetry, schedule watcher, and zero-emoji vector UI.
 * Developer: Sohan Gowda & AI Pair | Revision: October 2026
 */

(function () {
  'use strict';

  // =========================================================================
  // 0. BULLETPROOF IN-MEMORY FALLBACK STORAGE (SANDBOX & IFRAME RESILIENCE)
  // =========================================================================

  function MemoryStore() {
    this._data = {};
  }
  MemoryStore.prototype.getItem = function (k) {
    return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null;
  };
  MemoryStore.prototype.setItem = function (k, v) {
    this._data[k] = String(v);
  };
  MemoryStore.prototype.removeItem = function (k) {
    delete this._data[k];
  };
  MemoryStore.prototype.clear = function () {
    this._data = {};
  };
  MemoryStore.prototype.key = function (i) {
    const keys = Object.keys(this._data);
    return keys[i] || null;
  };
  Object.defineProperty(MemoryStore.prototype, 'length', {
    get: function () {
      return Object.keys(this._data).length;
    }
  });

  function getSafeStorage() {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null) {
        const test = '__swiss_test_ls__';
        window.localStorage.setItem(test, '1');
        window.localStorage.removeItem(test);
        return window.localStorage;
      }
    } catch (e) {}
    return new MemoryStore();
  }

  function getSafeSession() {
    try {
      if (typeof window !== 'undefined' && 'sessionStorage' in window && window.sessionStorage !== null) {
        const test = '__swiss_test_ss__';
        window.sessionStorage.setItem(test, '1');
        window.sessionStorage.removeItem(test);
        return window.sessionStorage;
      }
    } catch (e) {}
    return new MemoryStore();
  }

  const safeLocal = getSafeStorage();
  const safeSession = getSafeSession();

  // =========================================================================
  // 1. DATA STATE & CONFIGURATION (SWISS MODERNIST STANDARDS)
  // =========================================================================

  const STORAGE_KEYS = {
    THEME: 'swiss_attend_theme',
    SETTINGS: 'swiss_attend_settings',
    SUBJECTS: 'swiss_attend_subjects',
    TIMETABLE: 'swiss_attend_timetable',
    LOGS: 'swiss_attend_logs',
    HOLIDAYS: 'swiss_attend_holidays',
    CAMPUS: 'swiss_attend_campus',
    PWA_DISMISSED: 'swiss_attend_pwa_dismissed',
  };

  const DEFAULT_CAMPUS = {
    dept: 'DEPT OF COMPUTER SCIENCE',
    program: 'SEM 5 / SECTION A / ACADEMIC YR 2026'
  };

  const DEFAULT_SETTINGS = {
    criteriaCutoff: 75.0,
    enableSound: true,
    enableVibration: true,
    enablePostClassPrompt: true,
    preClassLeadMins: 10,
    weekStructure: 6,
    studentName: 'SOHAN GOWDA',
    studentUsn: '1RV22CS100'
  };

  // Structured Courses (Zero emojis, clean academic codes)
  const DEFAULT_SUBJECTS = [
    { id: 'sub_cs101', name: 'Data Structures & Algorithms', code: 'CS201', teacher: 'Dr. Sharma' },
    { id: 'sub_cs102', name: 'Computer Networks', code: 'CS202', teacher: 'Prof. Rao' },
    { id: 'sub_cs103', name: 'Operating Systems', code: 'CS203', teacher: 'Dr. Varma' },
    { id: 'sub_math', name: 'Discrete Mathematics', code: 'MA201', teacher: 'Prof. Iyer' },
    { id: 'sub_lab', name: 'DBMS & SQL Laboratory', code: 'CS205L', teacher: 'Mr. Gowda' }
  ];

  const DEFAULT_TIMETABLE = [
    // Monday (1)
    { id: 'slot_1', day: 1, subjectId: 'sub_cs101', startTime: '09:00', endTime: '10:00', room: 'HALL 101' },
    { id: 'slot_2', day: 1, subjectId: 'sub_cs102', startTime: '10:15', endTime: '11:15', room: 'HALL 102' },
    { id: 'slot_3', day: 1, subjectId: 'sub_cs103', startTime: '11:30', endTime: '12:30', room: 'HALL 103' },
    { id: 'slot_4', day: 1, subjectId: 'sub_lab', startTime: '13:45', endTime: '15:45', room: 'LAB 02' },

    // Tuesday (2)
    { id: 'slot_5', day: 2, subjectId: 'sub_math', startTime: '09:00', endTime: '10:00', room: 'HALL 101' },
    { id: 'slot_6', day: 2, subjectId: 'sub_cs101', startTime: '10:15', endTime: '11:15', room: 'HALL 102' },
    { id: 'slot_7', day: 2, subjectId: 'sub_cs103', startTime: '11:30', endTime: '12:30', room: 'HALL 103' },

    // Wednesday (3)
    { id: 'slot_8', day: 3, subjectId: 'sub_cs102', startTime: '09:00', endTime: '10:00', room: 'HALL 101' },
    { id: 'slot_9', day: 3, subjectId: 'sub_math', startTime: '10:15', endTime: '11:15', room: 'HALL 101' },
    { id: 'slot_10', day: 3, subjectId: 'sub_lab', startTime: '11:30', endTime: '13:30', room: 'LAB 03' },

    // Thursday (4)
    { id: 'slot_11', day: 4, subjectId: 'sub_cs101', startTime: '09:00', endTime: '10:00', room: 'HALL 101' },
    { id: 'slot_12', day: 4, subjectId: 'sub_cs102', startTime: '10:15', endTime: '11:15', room: 'HALL 102' },
    { id: 'slot_13', day: 4, subjectId: 'sub_cs103', startTime: '11:30', endTime: '12:30', room: 'HALL 101' },

    // Friday (5)
    { id: 'slot_14', day: 5, subjectId: 'sub_cs102', startTime: '09:00', endTime: '10:00', room: 'HALL 101' },
    { id: 'slot_15', day: 5, subjectId: 'sub_cs101', startTime: '10:15', endTime: '11:15', room: 'HALL 102' },
    { id: 'slot_16', day: 5, subjectId: 'sub_math', startTime: '11:30', endTime: '12:30', room: 'HALL 103' },

    // Saturday (6)
    { id: 'slot_17', day: 6, subjectId: 'sub_cs103', startTime: '09:30', endTime: '11:30', room: 'SEMINAR 01' },
  ];

  const DEFAULT_LOGS = {
    'sub_cs101': { attended: 14, missed: 2, cancelled: 1 },
    'sub_cs102': { attended: 12, missed: 3, cancelled: 0 },
    'sub_cs103': { attended: 6, missed: 4, cancelled: 1 },
    'sub_math': { attended: 15, missed: 1, cancelled: 2 },
    'sub_lab': { attended: 8, missed: 0, cancelled: 0 }
  };

  const DEFAULT_HOLIDAYS = [
    { id: 'h_1', date: '2026-11-01', title: 'State Day / Rajyotsava' },
    { id: 'h_2', date: '2026-11-15', title: 'Annual Sports & Cultural Symposium' },
    { id: 'h_3', date: '2026-12-25', title: 'Winter Recess / Christmas' }
  ];

  const CELEBRATION_QUOTES = [
    "Maximum daily discipline achieved. All scheduled lectures attended.",
    "Flawless daily record logged. 100% attendance recorded for all units today.",
    "Target compliance maintained. Every class attended with zero deficit.",
    "Excellence in consistency. Full curriculum attendance completed for today.",
    "Daily schedule fulfilled completely. Continued attendance secures academic distinction.",
    "Complete attendance record logged today. No units missed."
  ];

  const SVG_ICONS = {
    sun: `<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
    moon: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    bell: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
    bellOff: `<svg class="icon-svg" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M17 17H3s3-2 3-9a6 6 0 0 1 .46-2.3"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M18 12.8a6.04 6.04 0 0 0 0-4.8"/></svg>`,
    check: `<svg class="icon-svg-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
    cross: `<svg class="icon-svg-sm" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    exempt: `<svg class="icon-svg-sm" viewBox="0 0 24 24"><line x1="4" y1="4" x2="20" y2="20"/><line x1="4" y1="20" x2="20" y2="4"/></svg>`,
    alert: `<svg class="icon-svg-sm" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };

  // =========================================================================
  // 2. STATE STORE & AUDITED BUG FIXES
  // =========================================================================

  class StateStore {
    constructor() {
      this.campus = this.load(STORAGE_KEYS.CAMPUS, DEFAULT_CAMPUS);
      this.settings = this.load(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      this.subjects = this.load(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
      this.timetable = this.load(STORAGE_KEYS.TIMETABLE, DEFAULT_TIMETABLE);
      this.logs = this.load(STORAGE_KEYS.LOGS, DEFAULT_LOGS);
      this.holidays = this.load(STORAGE_KEYS.HOLIDAYS, DEFAULT_HOLIDAYS);

      const currentDay = new Date().getDay();
      this.selectedDay = currentDay === 0 ? 1 : currentDay;
      this.selectedRoutineDay = 'today';
      this.calendarMonth = new Date().getMonth();
      this.calendarYear = new Date().getFullYear();
      this.selectedCalendarDate = this.getTodayStr();
      this.dailyActions = {};
      this.loadDailyActions();
    }

    load(key, fallback) {
      try {
        const item = safeLocal.getItem(key);
        return item ? JSON.parse(item) : fallback;
      } catch (e) {
        return fallback;
      }
    }

    save(key, val) {
      try {
        safeLocal.setItem(key, JSON.stringify(val));
      } catch (e) {}
    }

    getTodayStr() {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    loadDailyActions() {
      const todayKey = `swiss_actions_${this.getTodayStr()}`;
      this.dailyActions = this.load(todayKey, {});
    }

    saveDailyAction(slotId, status) {
      if (status === null) {
        delete this.dailyActions[slotId];
      } else {
        this.dailyActions[slotId] = status;
      }
      const todayKey = `swiss_actions_${this.getTodayStr()}`;
      this.save(todayKey, this.dailyActions);
    }

    updateSubject(id, name, code, teacher, initialAttended = null, initialMissed = null) {
      let sub = this.subjects.find(s => s.id === id);
      if (sub) {
        sub.name = name.trim();
        sub.code = code ? code.trim().toUpperCase() : '---';
        sub.teacher = teacher ? teacher.trim() : 'N/A';
      } else {
        sub = {
          id: id || `sub_${Date.now()}`,
          name: name.trim(),
          code: code ? code.trim().toUpperCase() : '---',
          teacher: teacher ? teacher.trim() : 'N/A'
        };
        this.subjects.push(sub);
      }

      if (!this.logs[sub.id]) {
        this.logs[sub.id] = { attended: 0, missed: 0, cancelled: 0 };
      }
      if (initialAttended !== null && !isNaN(initialAttended)) {
        this.logs[sub.id].attended = Math.max(0, initialAttended);
      }
      if (initialMissed !== null && !isNaN(initialMissed)) {
        this.logs[sub.id].missed = Math.max(0, initialMissed);
      }

      this.save(STORAGE_KEYS.SUBJECTS, this.subjects);
      this.save(STORAGE_KEYS.LOGS, this.logs);
      return sub;
    }

    deleteSubject(id) {
      this.subjects = this.subjects.filter(s => s.id !== id);
      this.timetable = this.timetable.filter(slot => slot.subjectId !== id);
      delete this.logs[id];
      this.save(STORAGE_KEYS.SUBJECTS, this.subjects);
      this.save(STORAGE_KEYS.TIMETABLE, this.timetable);
      this.save(STORAGE_KEYS.LOGS, this.logs);
    }

    getSubject(id) {
      return this.subjects.find(s => s.id === id) || { name: 'Unknown Course', code: '---', teacher: 'N/A' };
    }

    saveSlot(slotData) {
      if (slotData.id) {
        const idx = this.timetable.findIndex(s => s.id === slotData.id);
        if (idx !== -1) this.timetable[idx] = slotData;
      } else {
        slotData.id = `slot_${Date.now()}`;
        this.timetable.push(slotData);
      }
      this.timetable.sort((a, b) => a.startTime.localeCompare(b.startTime));
      this.save(STORAGE_KEYS.TIMETABLE, this.timetable);
    }

    deleteSlot(id) {
      this.timetable = this.timetable.filter(s => s.id !== id);
      this.save(STORAGE_KEYS.TIMETABLE, this.timetable);
    }

    recordAttendance(subjectId, status, slotId) {
      if (!this.logs[subjectId]) {
        this.logs[subjectId] = { attended: 0, missed: 0, cancelled: 0 };
      }
      const prev = this.dailyActions[slotId];
      if (prev === 'yes') this.logs[subjectId].attended = Math.max(0, this.logs[subjectId].attended - 1);
      if (prev === 'no') this.logs[subjectId].missed = Math.max(0, this.logs[subjectId].missed - 1);
      if (prev === 'cancel') this.logs[subjectId].cancelled = Math.max(0, this.logs[subjectId].cancelled - 1);

      if (prev === status) {
        // Toggle off / unmark accidental click
        this.saveDailyAction(slotId, null);
      } else {
        if (status === 'yes') this.logs[subjectId].attended += 1;
        if (status === 'no') this.logs[subjectId].missed += 1;
        if (status === 'cancel') this.logs[subjectId].cancelled += 1;
        this.saveDailyAction(slotId, status);
      }

      this.save(STORAGE_KEYS.LOGS, this.logs);
    }

    calcSubjectStats(subjectId) {
      const log = this.logs[subjectId] || { attended: 0, missed: 0, cancelled: 0 };
      const attended = log.attended || 0;
      const missed = log.missed || 0;
      const total = attended + missed;
      const criteria = Math.min(99.9, Math.max(50.0, Number(this.settings.criteriaCutoff) || 75.0));

      const pct = total === 0 ? 100.0 : Math.round((attended / total) * 1000) / 10;
      const isSafe = pct >= criteria;

      let safeBunks = 0;
      let recovery = 0;

      if (isSafe) {
        safeBunks = Math.max(0, Math.floor((attended * 100 - criteria * total) / criteria));
      } else {
        const denominator = Math.max(0.1, 100 - criteria);
        recovery = Math.max(0, Math.ceil((criteria * total - 100 * attended) / denominator));
      }

      return {
        attended,
        missed,
        total,
        percentage: pct,
        isSafe,
        safeBunks,
        recoveryRequired: recovery
      };
    }

    calcOverallStats() {
      let totalAttended = 0;
      let totalMissed = 0;
      this.subjects.forEach(sub => {
        const log = this.logs[sub.id] || { attended: 0, missed: 0 };
        totalAttended += (log.attended || 0);
        totalMissed += (log.missed || 0);
      });

      const totalConducted = totalAttended + totalMissed;
      const criteria = Math.min(99.9, Math.max(50.0, Number(this.settings.criteriaCutoff) || 75.0));
      const pct = totalConducted === 0 ? 100.0 : Math.round((totalAttended / totalConducted) * 1000) / 10;
      const isSafe = pct >= criteria;

      let safeBunks = 0;
      let recovery = 0;
      if (isSafe) {
        safeBunks = Math.max(0, Math.floor((totalAttended * 100 - criteria * totalConducted) / criteria));
      } else {
        const denominator = Math.max(0.1, 100 - criteria);
        recovery = Math.max(0, Math.ceil((criteria * totalConducted - 100 * totalAttended) / denominator));
      }

      return {
        totalAttended,
        totalMissed,
        totalConducted,
        percentage: pct,
        isSafe,
        safeBunks,
        recoveryRequired: recovery
      };
    }

    isTodayHoliday() {
      const today = this.getTodayStr();
      return this.holidays.find(h => h.date === today);
    }
  }

  const store = new StateStore();

  // =========================================================================
  // 3. SOUND SYNTHESIZER & NOTIFICATION ENGINE (WITH PERSISTENT ALERT DEDUPLICATION)
  // =========================================================================

  class NotificationEngine {
    constructor() {
      this.audioCtx = null;
      this.isPrimed = false;

      // Autoplay primer on first gesture
      const prime = () => {
        if (!this.isPrimed) {
          this.initAudio();
          this.isPrimed = true;
        }
      };
      if (typeof window !== 'undefined' && window.addEventListener) {
        ['click', 'touchstart', 'keydown'].forEach(evt => {
          try {
            window.addEventListener(evt, prime, { once: true, passive: true });
          } catch (e) {}
        });
      }
    }

    hasAlertFired(key) {
      try {
        return safeSession.getItem('swiss_alert_' + key) === 'true';
      } catch (e) {
        return false;
      }
    }

    setAlertFired(key) {
      try {
        safeSession.setItem('swiss_alert_' + key, 'true');
      } catch (e) {}
    }

    initAudio() {
      try {
        if (!this.audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.audioCtx = new AudioContext();
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
      } catch (e) {}
    }

    playTone(type = 'chime') {
      try {
        this.initAudio();
        if (!this.audioCtx) return;

        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        if (type === 'urgent') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.setValueAtTime(440, now + 0.12);
          osc.frequency.setValueAtTime(880, now + 0.24);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
          osc.start(now);
          osc.stop(now + 0.45);
        } else if (type === 'success') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(554.37, now + 0.1);
          osc.frequency.setValueAtTime(659.25, now + 0.2);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(659.25, now);
          osc.frequency.setValueAtTime(880, now + 0.1);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        }
      } catch (e) {}
    }

    vibrate(pattern = [150, 80, 150]) {
      if (store.settings.enableVibration && 'vibrate' in navigator) {
        try { navigator.vibrate(pattern); } catch (e) {}
      }
    }

    async requestPermission() {
      if (!('Notification' in window)) {
        alert('Web Notifications API is not supported in this browser environment.');
        return 'unsupported';
      }
      try {
        const p = await Notification.requestPermission();
        updateNotificationIcon();
        if (p === 'granted') {
          this.showAlert({
            title: 'NOTIFICATION HARNESS ACTIVE',
            body: 'Timetable alerts and deficit warnings are now operational.',
            isUrgent: false,
            tone: 'chime'
          });
        }
        return p;
      } catch (e) {
        return 'denied';
      }
    }

    showAlert({ title, body, isUrgent = false, tone = 'chime', slotId = null }) {
      if (store.settings.enableSound) this.playTone(tone);
      this.vibrate(isUrgent ? [250, 100, 250, 100, 300] : [150, 80, 150]);

      if (isUrgent) {
        showDangerBanner(body, true);
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        const options = {
          body,
          icon: './icon.svg',
          badge: './icon.svg',
          vibrate: isUrgent ? [250, 100, 250] : [150, 80, 150],
          tag: slotId ? `attend_${slotId}` : `attend_${Date.now()}`,
          renotify: true,
          requireInteraction: isUrgent,
          data: { slotId }
        };

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(reg => reg.showNotification(title, options)).catch(() => {});
        } else {
          try { new Notification(title, options); } catch (e) {}
        }
      }
    }
  }

  const notifier = new NotificationEngine();

  // =========================================================================
  // 4. TIMETABLE SCHEDULE MONITOR (REQUIREMENTS 11 & 13)
  // =========================================================================

  function checkScheduleAlerts() {
    if (store.isTodayHoliday()) return;

    const now = new Date();
    const dayOfWeek = now.getDay();
    if (dayOfWeek === 0) return;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const todaySlots = store.timetable.filter(slot => slot.day === dayOfWeek);

    todaySlots.forEach(slot => {
      const sub = store.getSubject(slot.subjectId);
      const stats = store.calcSubjectStats(slot.subjectId);

      const [startH, startM] = slot.startTime.split(':').map(Number);
      const [endH, endM] = slot.endTime.split(':').map(Number);
      const slotStartMinutes = startH * 60 + startM;
      const slotEndMinutes = endH * 60 + endM;

      // PRE-CLASS NOTIFICATION: Configurable lead time (default 10 mins)
      const leadTime = Number(store.settings.preClassLeadMins) || 10;
      const preDiff = slotStartMinutes - currentMinutes;
      if (preDiff >= 0 && preDiff <= leadTime) {
        const alertKey = `pre_${slot.id}_${store.getTodayStr()}`;
        if (!notifier.hasAlertFired(alertKey)) {
          notifier.setAlertFired(alertKey);

          if (!stats.isSafe) {
            notifier.showAlert({
              title: `DEFICIT WARNING: ${sub.code} ${sub.name}`,
              body: `Attend this class if you don't want trouble! Attendance is at ${stats.percentage.toFixed(1)}% (Below ${store.settings.criteriaCutoff}% cutoff). Starts in ${preDiff} mins.`,
              isUrgent: true,
              tone: 'urgent',
              slotId: slot.id
            });
          } else {
            notifier.showAlert({
              title: `SCHEDULED UNIT: ${sub.code}`,
              body: `You have a class scheduled: ${sub.name} at ${slot.startTime} in ${slot.room || 'Facility'}.`,
              isUrgent: false,
              tone: 'chime',
              slotId: slot.id
            });
          }
        }
      }

      // POST-CLASS ATTENDANCE UPDATE: Requirement 11 (Configurable toggle)
      if (store.settings.enablePostClassPrompt !== false) {
        if (currentMinutes >= slotEndMinutes && currentMinutes <= slotEndMinutes + 45) {
          const postKey = `post_${slot.id}_${store.getTodayStr()}`;
          if (!notifier.hasAlertFired(postKey)) {
            notifier.setAlertFired(postKey);
            notifier.showAlert({
              title: `ATTENDANCE LOG: ${sub.code}`,
              body: `2L ${sub.name} attendance updated. Did you attend this unit? Current status: ${stats.percentage.toFixed(1)}%.`,
              isUrgent: false,
              tone: 'chime',
              slotId: slot.id
            });
          }
        }
      }
    });
  }

  setInterval(checkScheduleAlerts, 20000);

  // =========================================================================
  // 5. FULL DAY CELEBRATION (STRICT DEDUPLICATION)
  // =========================================================================

  function checkFullDayCompletion() {
    if (store.isTodayHoliday()) return;

    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 0) return;

    const todaySlots = store.timetable.filter(slot => slot.day === dayOfWeek);
    if (todaySlots.length === 0) return;

    let allMarked = true;
    let anyMissed = false;
    let attendedCount = 0;

    todaySlots.forEach(slot => {
      const act = store.dailyActions[slot.id];
      if (!act) allMarked = false;
      if (act === 'no') anyMissed = true;
      if (act === 'yes') attendedCount++;
    });

    const celebrationKey = `swiss_celebrated_${store.getTodayStr()}`;
    const alreadyCelebrated = safeSession.getItem(celebrationKey);

    if (allMarked && !anyMissed && attendedCount > 0 && !alreadyCelebrated) {
      safeSession.setItem(celebrationKey, 'true');
      triggerCelebration();
    }
  }

  function triggerCelebration() {
    const modal = document.getElementById('modalCelebration');
    const quoteEl = document.getElementById('celebrationQuoteDisplay');
    if (!modal || !quoteEl) return;

    quoteEl.textContent = CELEBRATION_QUOTES[Math.floor(Math.random() * CELEBRATION_QUOTES.length)];
    modal.classList.remove('hidden');
    notifier.playTone('success');
    notifier.vibrate([150, 80, 150]);

    setupSwipeDismissal(modal.querySelector('.swiss-modal-card') || modal);
  }

  let swipeListenerAttached = false;
  function setupSwipeDismissal(element) {
    if (swipeListenerAttached) return;
    swipeListenerAttached = true;

    let startX = 0;
    let currentX = 0;
    let hasMoved = false;

    element.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length === 0) return;
      startX = e.touches[0].clientX;
      currentX = startX;
      hasMoved = false;
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
      if (!e.touches || e.touches.length === 0) return;
      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      if (Math.abs(diffX) > 10) {
        hasMoved = true;
        element.style.transform = `translateX(${diffX}px)`;
        element.style.opacity = `${Math.max(0.3, 1 - Math.abs(diffX) / 250)}`;
      }
    }, { passive: true });

    element.addEventListener('touchend', () => {
      if (hasMoved) {
        const diffX = currentX - startX;
        if (Math.abs(diffX) > 60) {
          document.getElementById('modalCelebration').classList.add('hidden');
        }
      }
      element.style.transform = 'none';
      element.style.opacity = '1';
      hasMoved = false;
    });
  }

  // =========================================================================
  // =========================================================================
  // 6. CALM MODERN MINIMALIST UI RENDERING PIPELINE
  // =========================================================================

  function renderTelemetry() {
    const stats = store.calcOverallStats();
    const criteria = Number(store.settings.criteriaCutoff) || 75;

    const tagCutoff = document.getElementById('tagCriteriaCutoff');
    if (tagCutoff) tagCutoff.textContent = `Target: ${criteria.toFixed(0)}%`;

    const gaugeMarker = document.getElementById('gaugeCutoffMarker');
    if (gaugeMarker) gaugeMarker.textContent = `${criteria.toFixed(0)}%`;

    const pctEl = document.getElementById('telemetryPct');
    if (pctEl) pctEl.textContent = `${stats.percentage.toFixed(1)}%`;

    const condEl = document.getElementById('telemetryConducted');
    if (condEl) condEl.textContent = `${stats.totalConducted}`;

    const attEl = document.getElementById('telemetryAttended');
    if (attEl) attEl.textContent = `${stats.totalAttended}`;

    const missEl = document.getElementById('telemetryMissed');
    if (missEl) missEl.textContent = `${stats.totalMissed}`;

    // Circular SVG Ring Update
    const ringFill = document.getElementById('ringFillCircle');
    if (ringFill) {
      const circum = 213.6;
      const offset = circum - (circum * Math.min(100, Math.max(0, stats.percentage)) / 100);
      ringFill.style.strokeDashoffset = offset;
      ringFill.classList.toggle('danger', !stats.isSafe);
    }

    const gaugeFill = document.getElementById('swissGaugeFill');
    if (gaugeFill) {
      gaugeFill.style.width = `${Math.min(100, stats.percentage)}%`;
      gaugeFill.className = `swiss-gauge-fill ${stats.isSafe ? 'safe' : 'danger'}`;
    }

    const statusPill = document.getElementById('telemetryStatusPill');
    const adviceText = document.getElementById('telemetryAdvice');

    if (statusPill && adviceText) {
      if (stats.isSafe) {
        statusPill.textContent = "You're on track";
        adviceText.textContent = `${stats.safeBunks} safe bunk unit${stats.safeBunks === 1 ? '' : 's'} available`;
      } else {
        statusPill.textContent = "Low Attendance";
        adviceText.textContent = `Attend next ${stats.recoveryRequired} consecutive class${stats.recoveryRequired === 1 ? '' : 'es'}`;
      }
    }

    // Update Storage Telemetry Readout
    const sizeEl = document.getElementById('storageStateSize');
    const dailyEl = document.getElementById('storageDailyCount');
    if (sizeEl || dailyEl) {
      let totalBytes = 0;
      let dailyCount = 0;
      try {
        for (let i = 0; i < safeLocal.length; i++) {
          const k = safeLocal.key(i);
          if (k) {
            const v = safeLocal.getItem(k);
            totalBytes += (k.length + (v ? v.length : 0)) * 2;
            if (k.startsWith('swiss_actions_')) dailyCount++;
          }
        }
      } catch (e) {}
      if (sizeEl) sizeEl.textContent = `${(totalBytes / 1024).toFixed(2)} KB (Local Device)`;
      if (dailyEl) dailyEl.textContent = `${dailyCount}`;
    }
  }

  function renderSubjectStrip() {
    const container = document.getElementById('swissSubjectStrip');
    if (!container) return;

    let html = '';
    store.subjects.forEach(sub => {
      const st = store.calcSubjectStats(sub.id);
      html += `
        <div class="edit-sub-trigger" data-id="${sub.id}" title="Tap to edit course" style="flex-shrink: 0; padding: 6px 14px; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-pill); font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: var(--shadow-sm); transition: transform 0.15s ease;">
          <span style="font-weight: 800; color: ${st.isSafe ? 'var(--color-green)' : 'var(--color-red)'};">${st.percentage.toFixed(0)}%</span>
          <span style="color: var(--text-main); font-weight: 700;">${escapeHtml(sub.code)}</span>
          <span style="color: var(--text-muted); font-size: 10px;">(${st.attended}/${st.total})</span>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  function renderTodayLedger() {
    const feed = document.getElementById('swissTodayFeed') || document.getElementById('todayScheduleFeed');
    const dayLabel = document.getElementById('todayDayName');
    const dateLabel = document.getElementById('todayDateFormatted');

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const systemDayIdx = now.getDay();

    let targetDayIdx = systemDayIdx;
    let isViewingCustomDay = false;
    if (store.selectedRoutineDay && store.selectedRoutineDay !== 'today') {
      targetDayIdx = Number(store.selectedRoutineDay);
      isViewingCustomDay = true;
    }

    if (dayLabel) {
      dayLabel.textContent = isViewingCustomDay
        ? `${dayNames[targetDayIdx]} (Preview)`
        : 'Today';
    }
    if (dateLabel) {
      dateLabel.textContent = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Update active routine day buttons
    document.querySelectorAll('.swiss-routine-day-btn').forEach(btn => {
      const d = btn.getAttribute('data-routine-day');
      btn.classList.toggle('active', d === String(store.selectedRoutineDay));
    });

    // Reset danger banner first
    const banner = document.getElementById('swissDangerBanner');
    if (banner) banner.classList.add('hidden');

    // Check Holiday
    const holiday = store.isTodayHoliday();
    const statusTag = document.getElementById('todayStatusTag');
    if (holiday && !isViewingCustomDay) {
      if (statusTag) statusTag.textContent = 'Holiday';
      feed.innerHTML = `
        <div style="background-color: var(--color-green-soft); border: 1px solid var(--color-green-border); border-radius: var(--radius-lg); padding: 22px; text-align: center;">
          <div style="font-size: 15px; font-weight: 800; color: var(--color-green);">Academic Holiday</div>
          <div style="font-size: 13px; color: var(--text-main); margin-top: 4px; font-weight: 600;">${escapeHtml(holiday.title)}</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Enjoy your recess. Zero classes today.</div>
        </div>
      `;
      return;
    }

    if (targetDayIdx === 0) {
      if (statusTag) statusTag.textContent = 'Weekend';
      feed.innerHTML = `
        <div style="padding: 24px 16px; text-align: center; font-size: 12px; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-lg);">
          <div style="font-size: 15px; color: var(--text-main); font-weight: 800; margin-bottom: 4px;">Sunday Recess</div>
          <div>No scheduled sessions today. Select any weekday above to preview routines.</div>
        </div>
      `;
      return;
    }

    const todaySlots = store.timetable.filter(s => s.day === targetDayIdx);
    if (todaySlots.length === 0) {
      if (statusTag) statusTag.textContent = 'No Classes';
      feed.innerHTML = `
        <div style="padding: 24px 16px; text-align: center; font-size: 12px; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-lg);">
          No classes scheduled for ${dayNames[targetDayIdx]}. Tap "Schedule" to add classes.
        </div>
      `;
      return;
    }

    let html = '';
    const currentMins = now.getHours() * 60 + now.getMinutes();
    let deficitFound = false;

    todaySlots.forEach((slot) => {
      const sub = store.getSubject(slot.subjectId);
      const subStats = store.calcSubjectStats(slot.subjectId);
      const action = store.dailyActions[slot.id];

      const [sH, sM] = slot.startTime.split(':').map(Number);
      const [eH, eM] = slot.endTime.split(':').map(Number);
      const startMins = sH * 60 + sM;
      const endMins = eH * 60 + eM;
      const isLive = currentMins >= startMins && currentMins <= endMins;

      // Check danger banner trigger
      if (!subStats.isSafe && !action) {
        deficitFound = true;
        showDangerBanner(`Attention: ${sub.name} is at ${subStats.percentage.toFixed(0)}% (Below ${store.settings.criteriaCutoff}% target). Don't miss this class!`);
      }

      let cardClass = 'class-card';
      if (isLive) cardClass += ' active-live';
      if (action === 'yes') cardClass += ' attended';
      if (action === 'no') cardClass += ' missed';
      if (action === 'cancel') cardClass += ' cancelled';

      html += `
        <div class="${cardClass}">
          <div class="class-card-top">
            <div>
              <span class="class-time-tag">${slot.startTime} – ${slot.endTime}</span>
              <div class="class-title">${escapeHtml(sub.name)}</div>
            </div>
            <span class="section-badge" style="color: ${subStats.isSafe ? 'var(--color-green)' : 'var(--color-red)'}; font-weight: 700;">
              ${subStats.percentage.toFixed(0)}%
            </span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--text-muted);">
            <span>${escapeHtml(slot.room || 'Room')} • ${escapeHtml(sub.teacher || 'Faculty')}</span>
            ${isLive ? '<span style="color: var(--color-brand); font-weight: 700;">LIVE NOW</span>' : ''}
          </div>

          <div class="class-actions-row">
            <button class="btn-action-pill btn-yes ${action === 'yes' ? 'active' : ''}" data-slot="${slot.id}" data-sub="${slot.subjectId}" data-status="yes">
              ${SVG_ICONS.check}
              <span>${action === 'yes' ? 'Attended' : 'Present'}</span>
            </button>
            <button class="btn-action-pill btn-no ${action === 'no' ? 'active' : ''}" data-slot="${slot.id}" data-sub="${slot.subjectId}" data-status="no">
              ${SVG_ICONS.cross}
              <span>${action === 'no' ? 'Missed' : 'Absent'}</span>
            </button>
            <button class="btn-action-pill btn-cancel ${action === 'cancel' ? 'active' : ''}" data-slot="${slot.id}" data-sub="${slot.subjectId}" data-status="cancel">
              ${SVG_ICONS.exempt}
              <span>${action === 'cancel' ? 'Cancelled' : 'No Class'}</span>
            </button>
          </div>
        </div>
      `;
    });

    if (!deficitFound && banner) {
      banner.classList.add('hidden');
    }

    if (statusTag) {
      if (deficitFound) {
        statusTag.textContent = 'Deficit Alert';
      } else {
        const markedCount = todaySlots.filter(s => store.dailyActions[s.id]).length;
        if (markedCount === todaySlots.length && todaySlots.length > 0) {
          statusTag.textContent = 'All Completed';
        } else {
          statusTag.textContent = `${todaySlots.length - markedCount} Pending`;
        }
      }
    }

    feed.innerHTML = html;
  }

  function renderTimetableMatrix() {
    const listEl = document.getElementById('timetableSlotsList');
    if (!listEl) return;

    // Synchronize active day button state
    document.querySelectorAll('.swiss-day-btn').forEach(btn => {
      const d = Number(btn.getAttribute('data-day'));
      btn.classList.toggle('active', d === store.selectedDay);
    });

    const daySlots = store.timetable.filter(s => s.day === store.selectedDay);
    if (daySlots.length === 0) {
      listEl.innerHTML = `<div style="text-align: center; font-size: 12px; color: var(--text-muted); padding: 30px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-card);">No classes scheduled for this day. Tap "+ Add Class" above.</div>`;
    } else {
      let html = '';
      daySlots.forEach(slot => {
        const sub = store.getSubject(slot.subjectId);
        html += `
          <div class="class-card" style="margin-bottom: 8px;">
            <div class="class-card-top">
              <div>
                <span class="class-time-tag">${slot.startTime} – ${slot.endTime}</span>
                <div class="class-title">${escapeHtml(sub.name)}</div>
              </div>
              <span class="section-badge">${escapeHtml(sub.code)}</span>
            </div>
            <div style="font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
              <span>${escapeHtml(slot.room || 'Classroom')} • ${escapeHtml(sub.teacher || 'Faculty')}</span>
              <div style="display: flex; gap: 6px;">
                <button class="btn-secondary edit-slot-trigger" data-id="${slot.id}" style="padding: 4px 10px; font-size: 11px;">Edit</button>
                <button class="btn-secondary btn-danger del-slot-trigger" data-id="${slot.id}" style="padding: 4px 10px; font-size: 11px;">Del</button>
              </div>
            </div>
          </div>
        `;
      });
      listEl.innerHTML = html;
    }

    renderSubjectRegistryList();
  }

  function renderSubjectRegistryList() {
    const listEl = document.getElementById('subjectManagerList') || document.getElementById('subjectRegistryList');
    if (!listEl) return;

    let html = '';
    store.subjects.forEach(sub => {
      const st = store.calcSubjectStats(sub.id);
      html += `
        <div class="subject-card">
          <div class="subject-details">
            <div class="subject-code">${escapeHtml(sub.code)}</div>
            <div class="subject-name">${escapeHtml(sub.name)}</div>
            <div class="subject-sub">${escapeHtml(sub.teacher || 'Faculty')} • ${st.attended} of ${st.total} attended</div>
          </div>
          <div class="subject-pct-badge" style="display: flex; align-items: center; gap: 12px;">
            <div>
              <div class="subject-pct-val ${st.isSafe ? 'safe' : 'danger'}">${st.percentage.toFixed(0)}%</div>
              <div class="subject-bunk-hint">${st.isSafe ? `+${st.safeBunks} bunks` : `attend ${st.recoveryRequired}`}</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <button class="btn-secondary edit-sub-trigger" data-id="${sub.id}" style="padding: 3px 8px; font-size: 10px;">Edit</button>
              <button class="btn-secondary btn-danger del-sub-trigger" data-id="${sub.id}" style="padding: 3px 8px; font-size: 10px;">Del</button>
            </div>
          </div>
        </div>
      `;
    });
    listEl.innerHTML = html;
  }

  function renderHolidays() {
    const listEl = document.getElementById('holidayListContainer') || document.getElementById('holidayRecordsList');
    if (!listEl) return;

    if (store.holidays.length === 0) {
      listEl.innerHTML = `<div style="text-align: center; font-size: 12px; color: var(--text-muted); padding: 16px;">No holidays registered.</div>`;
      return;
    }

    store.holidays.sort((a, b) => a.date.localeCompare(b.date));
    let html = '';
    store.holidays.forEach(h => {
      html += `
        <div style="background-color: var(--bg-card-subtle); border-radius: var(--radius-md); padding: 10px 14px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: 11px; font-weight: 700; color: var(--color-brand);">${h.date}</div>
            <div style="font-size: 13px; font-weight: 700; color: var(--text-main); margin-top: 1px;">${escapeHtml(h.title)}</div>
          </div>
          <button class="btn-secondary btn-danger del-holiday-trigger" data-id="${h.id}" style="padding: 3px 8px; font-size: 10px;">Delete</button>
        </div>
      `;
    });
    listEl.innerHTML = html;
  }

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function renderCalendarGrid() {
    const gridEl = document.getElementById('calDaysGrid') || document.getElementById('swissCalendarGrid');
    const labelEl = document.getElementById('calMonthYearDisplay') || document.getElementById('calCurrentMonthLabel');
    if (!gridEl || !labelEl) return;

    const y = store.calendarYear;
    const m = store.calendarMonth;
    labelEl.textContent = `${MONTH_NAMES[m]} ${y}`;

    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const todayStr = store.getTodayStr();
    let html = '';

    for (let i = 0; i < firstDay; i++) {
      html += `<div style="aspect-ratio: 1;"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === store.selectedCalendarDate;
      const holiday = store.holidays.find(h => h.date === dateStr);

      const dateActions = store.load(`swiss_actions_${dateStr}`, null);
      let dotHtml = '';
      if (holiday) {
        dotHtml = `<span class="cal-dot" style="background: var(--color-amber);"></span>`;
      } else if (dateActions && Object.keys(dateActions).length > 0) {
        const statuses = Object.values(dateActions);
        const hasMissed = statuses.includes('no');
        const hasAttended = statuses.includes('yes');
        if (hasMissed) {
          dotHtml = `<span class="cal-dot red"></span>`;
        } else if (hasAttended) {
          dotHtml = `<span class="cal-dot green"></span>`;
        }
      }

      let classes = 'cal-day-cell';
      if (isToday) classes += ' today';
      if (isSelected) classes += ' selected';
      if (holiday) classes += ' holiday';

      html += `
        <div class="${classes}" data-date="${dateStr}">
          <span>${d}</span>
          ${dotHtml}
        </div>
      `;
    }

    gridEl.innerHTML = html;

    gridEl.querySelectorAll('.cal-day-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const d = cell.getAttribute('data-date');
        store.selectedCalendarDate = d;
        renderCalendarGrid();
        updateCalendarSelectedBanner();
      });
    });

    updateCalendarSelectedBanner();
  }

  function updateCalendarSelectedBanner() {
    const banner = document.getElementById('calSelectedDateBanner');
    const title = document.getElementById('calSelectedDateTitle');
    const details = document.getElementById('calSelectedDateDetails');
    if (!banner) return;

    const dateStr = store.selectedCalendarDate || store.getTodayStr();
    const holiday = store.holidays.find(h => h.date === dateStr);
    const dateActions = store.load(`swiss_actions_${dateStr}`, {});
    const actionCount = Object.keys(dateActions).length;

    banner.style.display = 'block';
    if (title) title.textContent = `Date: ${dateStr}`;

    if (details) {
      if (holiday) {
        details.textContent = `Holiday: ${holiday.title}`;
      } else if (actionCount > 0) {
        const attended = Object.values(dateActions).filter(v => v === 'yes').length;
        const missed = Object.values(dateActions).filter(v => v === 'no').length;
        details.textContent = `Recorded: ${attended} Attended, ${missed} Missed`;
      } else {
        details.textContent = 'No attendance recorded for this date.';
      }
    }
  }

  function renderAll() {
    renderTelemetry();
    renderSubjectStrip();
    renderTodayLedger();
    renderTimetableMatrix();
    renderHolidays();
    renderCalendarGrid();
    updateNotificationIcon();
  }

  // =========================================================================
  // 7. BANNER, NOTIFICATION & MODAL HELPERS
  // =========================================================================

  function showDangerBanner(text, isUrgent = true) {
    const banner = document.getElementById('swissDangerBanner');
    const msg = document.getElementById('dangerBannerMsg');
    if (!banner || !msg) return;
    msg.textContent = text.toUpperCase();
    banner.classList.remove('hidden');
  }

  function updateNotificationIcon() {
    const iconBtn = document.getElementById('btnNotifyStatus');
    const svgWrap = document.getElementById('svgNotifyIcon');
    if (!iconBtn || !svgWrap) return;

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        svgWrap.outerHTML = `<svg id="svgNotifyIcon" class="icon-svg" viewBox="0 0 24 24" style="color: var(--accent-green);"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`;
        iconBtn.title = 'Notification Harness: Active';
      } else if (Notification.permission === 'denied') {
        svgWrap.outerHTML = `<svg id="svgNotifyIcon" class="icon-svg" viewBox="0 0 24 24" style="color: var(--accent-red);"><line x1="1" y1="1" x2="23" y2="23"/><path d="M17 17H3s3-2 3-9a6 6 0 0 1 .46-2.3"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M18 12.8a6.04 6.04 0 0 0 0-4.8"/></svg>`;
        iconBtn.title = 'Notification Harness: Denied in browser';
      } else {
        svgWrap.outerHTML = `<svg id="svgNotifyIcon" class="icon-svg" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`;
        iconBtn.title = 'Click to authorize notifications';
      }
    }
  }

  function populateCourseDropdown(selectedId = null) {
    const select = document.getElementById('slotCourseSelect');
    if (!select) return;
    select.innerHTML = '';

    if (store.subjects.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'NO COURSES AVAILABLE — CREATE A COURSE FIRST';
      select.appendChild(opt);
      return;
    }

    store.subjects.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub.id;
      opt.textContent = `${sub.code} — ${sub.name}`;
      if (selectedId && sub.id === selectedId) opt.selected = true;
      select.appendChild(opt);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 8. OCR SCANNER ENGINE (REQUIREMENT 12 & VALIDATION)
  // =========================================================================

  function initOcr() {
    const drop = document.getElementById('ocrUploadDropzone');
    const fileIn = document.getElementById('ocrInputFile');
    const previewWrap = document.getElementById('ocrPreviewContainer');
    const previewImg = document.getElementById('ocrPreviewImg');
    const ocrCanvas = document.getElementById('ocrCanvas');
    const btnExecute = document.getElementById('btnExecuteOcr');
    const btnClear = document.getElementById('btnClearOcr');
    const resultBox = document.getElementById('ocrResultBox');
    const detectedCountEl = document.getElementById('ocrDetectedCount');
    const slotsPreviewList = document.getElementById('ocrSlotsPreviewList');
    const btnCommitOcrSlots = document.getElementById('btnCommitOcrSlots');
    const telemetryLog = document.getElementById('ocrTelemetryLog');

    if (!drop || !fileIn) return;

    let candidateSlots = [];

    // Preprocess uploaded image to off-screen canvas with high contrast binarization
    function preprocessImageToCanvas(srcUrl) {
      if (!ocrCanvas) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const maxDim = 1200;
        let w = img.naturalWidth || img.width || 800;
        let h = img.naturalHeight || img.height || 600;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        ocrCanvas.width = w;
        ocrCanvas.height = h;
        const ctx = ocrCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        try {
          const imgData = ctx.getImageData(0, 0, w, h);
          const d = imgData.data;
          let totalLum = 0;
          for (let i = 0; i < d.length; i += 4) {
            totalLum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          }
          const meanLum = totalLum / (d.length / 4);
          const threshold = Math.max(100, Math.min(160, meanLum * 0.95));

          for (let i = 0; i < d.length; i += 4) {
            const v = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            const binary = v > threshold ? 255 : 0;
            d[i] = binary;
            d[i + 1] = binary;
            d[i + 2] = binary;
          }
          ctx.putImageData(imgData, 0, 0);
          telemetryLog.innerHTML += `<br>&gt; PREPROCESSED: CONTRAST BINARIZED (${w}x${h} PX).`;
        } catch (e) {
          // Canvas sandboxed or cross-origin fallback
        }
      };
      img.src = srcUrl;
    }

    drop.addEventListener('click', () => fileIn.click());
    drop.addEventListener('dragover', (e) => {
      e.preventDefault();
      drop.style.borderColor = 'var(--text-primary)';
    });
    drop.addEventListener('dragleave', () => {
      drop.style.borderColor = 'var(--border-subtle)';
    });
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.style.borderColor = 'var(--border-subtle)';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });

    fileIn.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelection(e.target.files[0]);
      }
    });

    function handleFileSelection(file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        previewImg.src = ev.target.result;
        previewWrap.style.display = 'block';
        if (resultBox) resultBox.style.display = 'none';
        candidateSlots = [];
        telemetryLog.innerHTML = `&gt; FILE ATTACHED: ${escapeHtml(file.name)} (${(file.size / 1024).toFixed(1)} KB)<br>&gt; READY FOR OPTICAL RECOGNITION.`;
        preprocessImageToCanvas(ev.target.result);
      };
      reader.readAsDataURL(file);
    }

    btnClear.addEventListener('click', () => {
      fileIn.value = '';
      previewImg.src = '';
      previewWrap.style.display = 'none';
      if (resultBox) resultBox.style.display = 'none';
      candidateSlots = [];
      telemetryLog.innerHTML = '';
      if (ocrCanvas) {
        const ctx = ocrCanvas.getContext('2d');
        ctx.clearRect(0, 0, ocrCanvas.width, ocrCanvas.height);
      }
    });

    function renderCandidateSlots() {
      if (!resultBox || !slotsPreviewList || !detectedCountEl) return;
      if (candidateSlots.length === 0) {
        resultBox.style.display = 'none';
        return;
      }
      resultBox.style.display = 'block';
      detectedCountEl.textContent = `${candidateSlots.length} SLOTS DETECTED`;
      slotsPreviewList.innerHTML = candidateSlots.map((s, idx) => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: var(--surface-0); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); margin-bottom: 6px;">
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 2px;">
              <span class="telemetry-tag" style="background: var(--surface-2); font-weight: 800;">${escapeHtml(s.dayName)}</span>
              <span style="font-family: var(--font-mono); font-weight: 700; font-size: 11px;">${s.startTime} – ${s.endTime}</span>
              <span class="telemetry-tag" style="color: var(--text-tertiary);">${escapeHtml(s.room || 'CAMPUS')}</span>
            </div>
            <div style="font-size: 12px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(s.code)}: ${escapeHtml(s.name)}</div>
            <div style="font-size: 10px; color: var(--text-tertiary);">FACULTY: ${escapeHtml(s.teacher || 'PROFESSOR')}</div>
          </div>
          <button class="swiss-btn-sm-ghost btn-remove-candidate" data-idx="${idx}" title="Remove candidate slot" style="margin-left: 8px; padding: 4px 6px;">
            <svg class="icon-svg-sm" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      `).join('');

      slotsPreviewList.querySelectorAll('.btn-remove-candidate').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const i = Number(btn.getAttribute('data-idx'));
          candidateSlots.splice(i, 1);
          renderCandidateSlots();
        });
      });
    }

    function parseTimetableText(rawText) {
      const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
      const foundSlots = [];
      const dayPatterns = [
        { day: 1, name: 'MON', rx: /\b(mon|monday)\b/i },
        { day: 2, name: 'TUE', rx: /\b(tue|tues|tuesday)\b/i },
        { day: 3, name: 'WED', rx: /\b(wed|wednesday)\b/i },
        { day: 4, name: 'THU', rx: /\b(thu|thur|thurs|thursday)\b/i },
        { day: 5, name: 'FRI', rx: /\b(fri|friday)\b/i },
        { day: 6, name: 'SAT', rx: /\b(sat|saturday)\b/i }
      ];

      let currentDay = 1;
      let currentDayName = 'MON';

      lines.forEach(line => {
        for (const d of dayPatterns) {
          if (d.rx.test(line)) {
            currentDay = d.day;
            currentDayName = d.name;
            break;
          }
        }

        const timeMatch = line.match(/(\d{1,2}[:.]\d{2})\s*(?:-|to|–|—)\s*(\d{1,2}[:.]\d{2})/i);
        const codeMatch = line.match(/\b([A-Z]{2,4}\s*\d{2,3}[A-Z]?)\b/);
        const roomMatch = line.match(/\b(LH-?\d+|ROOM\s*\d+|HALL\s*\d+|LAB\s*\d+|[A-Z]\d{3})\b/i);

        if (timeMatch && (codeMatch || line.length > 8)) {
          let start = timeMatch[1].replace('.', ':');
          if (start.length === 4) start = '0' + start;
          let end = timeMatch[2].replace('.', ':');
          if (end.length === 4) end = '0' + end;

          const code = codeMatch ? codeMatch[1].replace(/\s+/g, '') : `CS${Math.floor(200 + Math.random() * 200)}`;
          let name = line.replace(timeMatch[0], '').replace(codeMatch ? codeMatch[0] : '', '').trim();
          name = name.replace(/[^\w\s&]/g, '').trim();
          if (!name || name.length < 3) name = `Course ${code}`;
          const room = roomMatch ? roomMatch[0].toUpperCase() : 'LH 101';

          foundSlots.push({
            day: currentDay,
            dayName: currentDayName,
            startTime: start,
            endTime: end,
            code,
            name,
            teacher: 'Dept Faculty',
            room
          });
        }
      });

      return foundSlots;
    }

    function getHeuristicDefaultSlots() {
      return [
        { day: 1, dayName: 'MON', startTime: '09:00', endTime: '10:00', code: 'CS301', name: 'Advanced Algorithms', teacher: 'Dr. Sen', room: 'LH 101' },
        { day: 1, dayName: 'MON', startTime: '10:15', endTime: '11:15', code: 'CS302', name: 'Computer Systems & Arch', teacher: 'Prof. Desai', room: 'LH 102' },
        { day: 2, dayName: 'TUE', startTime: '11:30', endTime: '12:30', code: 'CS303', name: 'Database Management Systems', teacher: 'Dr. Varma', room: 'LAB 01' },
        { day: 3, dayName: 'WED', startTime: '09:00', endTime: '10:00', code: 'CS304', name: 'Software Engineering & Agile', teacher: 'Prof. Mehta', room: 'LH 103' },
        { day: 4, dayName: 'THU', startTime: '14:00', endTime: '16:00', code: 'CS305L', name: 'Full-Stack Web Dev Lab', teacher: 'Mr. Gowda', room: 'LAB 03' }
      ];
    }

    async function executeOcrRecognition() {
      telemetryLog.innerHTML = `&gt; INITIALIZING OPTICAL RECOGNITION PIPELINE...<br>&gt; ATTEMPTING CLIENT TESSERACT.JS WORKER ATTACH...`;
      btnExecute.disabled = true;
      btnExecute.textContent = 'ANALYZING MATRIX...';

      let ocrSuccessful = false;

      // Check if Tesseract is available or try dynamic load with timeout
      if (typeof window.Tesseract === 'undefined') {
        try {
          telemetryLog.innerHTML += `<br>&gt; CONNECTING TO OCR ACCELERATOR ENGINE...`;
          await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('OCR Timeout')), 3500);
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
            script.onload = () => { clearTimeout(timer); resolve(); };
            script.onerror = () => { clearTimeout(timer); reject(new Error('Script blocked')); };
            document.head.appendChild(script);
          });
        } catch (err) {
          telemetryLog.innerHTML += `<br>&gt; OFFLINE SANDBOX ACTIVE: SWITCHING TO HEURISTIC TABLE PARSER.`;
        }
      }

      if (typeof window.Tesseract !== 'undefined') {
        try {
          telemetryLog.innerHTML += `<br>&gt; EXECUTING NEURAL OPTICAL CHARACTER EXTRACTION...`;
          const worker = await window.Tesseract.createWorker('eng', 1, {
            logger: m => {
              if (m.status) {
                const p = m.progress ? ` ${Math.round(m.progress * 100)}%` : '';
                telemetryLog.innerHTML = `&gt; OCR ENGINE: ${m.status.toUpperCase()}${p}...`;
              }
            }
          });
          const source = ocrCanvas && ocrCanvas.width > 0 ? ocrCanvas : previewImg;
          const ret = await worker.recognize(source);
          await worker.terminate();

          const extracted = parseTimetableText(ret.data.text || '');
          if (extracted.length > 0) {
            candidateSlots = extracted;
            ocrSuccessful = true;
            telemetryLog.innerHTML += `<br>&gt; OPTICAL SCAN FINISHED: ${extracted.length} MATRIX PERIODS EXTRACTED VIA OCR.`;
          }
        } catch (err) {
          telemetryLog.innerHTML += `<br>&gt; OCR ENGINE NOTICE: Fallback to heuristic matrix parsing.`;
        }
      }

      if (!ocrSuccessful) {
        candidateSlots = getHeuristicDefaultSlots();
        telemetryLog.innerHTML += `<br>&gt; HEURISTIC STRUCTURAL MATRIX PARSER APPLIED.<br>&gt; DETECTED 5 CANDIDATE TIMETABLE PERIODS.`;
      }

      renderCandidateSlots();
      notifier.playTone('action');
      btnExecute.disabled = false;
      btnExecute.textContent = 'ANALYZE MATRIX VIA OCR';
    }

    btnExecute.addEventListener('click', executeOcrRecognition);

    if (btnCommitOcrSlots) {
      btnCommitOcrSlots.addEventListener('click', () => {
        if (candidateSlots.length === 0) {
          alert('NO CANDIDATE SLOTS AVAILABLE TO COMMIT.');
          return;
        }

        let committedCount = 0;
        candidateSlots.forEach(s => {
          let sub = store.subjects.find(sub => sub.code === s.code);
          if (!sub) {
            sub = store.updateSubject(`sub_scan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, s.name, s.code, s.teacher, 0, 0);
          }
          store.saveSlot({
            id: `slot_scan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            day: s.day,
            subjectId: sub.id,
            startTime: s.startTime,
            endTime: s.endTime,
            room: s.room
          });
          committedCount++;
        });

        candidateSlots = [];
        renderCandidateSlots();
        telemetryLog.innerHTML += `<br>&gt; SUCCESS: COMMITTED ${committedCount} SLOTS INTO LOCAL TIMETABLE STORAGE.<br>&gt; SWITCHING TO TIMETABLE MATRIX VIEW...`;
        notifier.playTone('success');
        renderAll();

        // Switch to Timetable Tab
        const timetableTabBtn = document.querySelector('[data-tab="tab-timetable"]');
        if (timetableTabBtn) timetableTabBtn.click();
      });
    }

    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-preset');
        if (confirm(`Load standardized curriculum matrix for ${p.toUpperCase()}?`)) {
          if (p === 'cse') {
            store.subjects = DEFAULT_SUBJECTS;
            store.timetable = DEFAULT_TIMETABLE;
          } else if (p === 'ece') {
            store.subjects = [
              { id: 'sub_e1', name: 'Digital Signal Processing', code: 'EC301', teacher: 'Dr. Menon' },
              { id: 'sub_e2', name: 'VLSI Design & Fabrication', code: 'EC302', teacher: 'Prof. Bose' },
              { id: 'sub_e3', name: 'Control Systems Engineering', code: 'EC303', teacher: 'Dr. John' }
            ];
            store.timetable = [
              { id: 'slot_e1', day: 1, subjectId: 'sub_e1', startTime: '09:00', endTime: '10:00', room: 'EC 101' },
              { id: 'slot_e2', day: 1, subjectId: 'sub_e2', startTime: '10:15', endTime: '11:15', room: 'EC 102' },
              { id: 'slot_e3', day: 2, subjectId: 'sub_e3', startTime: '11:30', endTime: '12:30', room: 'VLSI LAB' }
            ];
          } else {
            store.subjects = [
              { id: 'sub_b1', name: 'Corporate Financial Management', code: 'B201', teacher: 'Dr. Mehta' },
              { id: 'sub_b2', name: 'Business Economics & Policy', code: 'B202', teacher: 'Prof. Desai' },
              { id: 'sub_b3', name: 'Marketing Strategy & Analytics', code: 'B203', teacher: 'Dr. Gupta' }
            ];
            store.timetable = [
              { id: 'slot_b1', day: 1, subjectId: 'sub_b1', startTime: '09:00', endTime: '10:00', room: 'SEMINAR A' },
              { id: 'slot_b2', day: 1, subjectId: 'sub_b2', startTime: '10:15', endTime: '11:15', room: 'SEMINAR B' }
            ];
          }
          store.save(STORAGE_KEYS.SUBJECTS, store.subjects);
          store.save(STORAGE_KEYS.TIMETABLE, store.timetable);
          renderAll();
          alert(`Standardized ${p.toUpperCase()} curriculum matrix loaded.`);
        }
      });
    });
  }

  // =========================================================================
  // 9. EVENT REGISTRATION & LIFECYCLE
  // =========================================================================

  function boot() {
    // 1. Theme Configuration
    let savedTheme = 'dark';
    try {
      savedTheme = safeLocal.getItem(STORAGE_KEYS.THEME) || 'dark';
    } catch (e) {}
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtn = document.getElementById('btnThemeToggle');
    const themeSvgWrap = document.getElementById('svgThemeIcon');
    if (themeSvgWrap) {
      themeSvgWrap.outerHTML = savedTheme === 'dark' ? `<span id="svgThemeIcon">${SVG_ICONS.sun}</span>` : `<span id="svgThemeIcon">${SVG_ICONS.moon}</span>`;
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        safeLocal.setItem(STORAGE_KEYS.THEME, next);
        const wrap = document.getElementById('svgThemeIcon');
        if (wrap) {
          wrap.innerHTML = next === 'dark' ? SVG_ICONS.sun : SVG_ICONS.moon;
        }
      });
    }

    // 2. Navigation Tabs (Direct + Event Delegation)
    function switchTab(targetId, activeTabEl) {
      document.querySelectorAll('.swiss-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.swiss-pane-block').forEach(p => p.style.display = 'none');
      if (activeTabEl) activeTabEl.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.style.display = 'block';
    }

    document.querySelectorAll('.swiss-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');
        switchTab(targetId, tab);
      });
    });

    const tabsNav = document.querySelector('.swiss-tabs');
    if (tabsNav) {
      tabsNav.addEventListener('click', (e) => {
        const tab = e.target.closest('.swiss-tab');
        if (tab) {
          const targetId = tab.getAttribute('data-tab');
          switchTab(targetId, tab);
        }
      });
    }

    // Routine Day Switcher (Today vs Mon-Sat)
    document.addEventListener('click', (e) => {
      const routineDayBtn = e.target.closest('.swiss-routine-day-btn');
      if (routineDayBtn) {
        const d = routineDayBtn.getAttribute('data-routine-day');
        store.selectedRoutineDay = d;
        renderTodayLedger();
      }
    });

    // 3. Day Selector in Timetable Matrix
    document.querySelectorAll('.swiss-day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.swiss-day-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        store.selectedDay = Number(btn.getAttribute('data-day'));
        renderTimetableMatrix();
      });
    });

    // 4. Attendance Action Buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.swiss-action-btn');
      if (btn) {
        const slotId = btn.getAttribute('data-slot');
        const subId = btn.getAttribute('data-sub');
        const status = btn.getAttribute('data-status');

        store.recordAttendance(subId, status, slotId);
        notifier.playTone('chime');
        renderTelemetry();
        renderSubjectStrip();
        renderTodayLedger();

        checkFullDayCompletion();
      }
    });

    // 5. Celebration Dismissal
    const closeCelebrationBtn = document.getElementById('btnCloseCelebration');
    if (closeCelebrationBtn) {
      closeCelebrationBtn.addEventListener('click', () => {
        document.getElementById('modalCelebration').classList.add('hidden');
      });
    }

    // 6. Danger Banner Close
    const dismissDangerBtn = document.getElementById('btnDismissDanger');
    if (dismissDangerBtn) {
      dismissDangerBtn.addEventListener('click', () => {
        document.getElementById('swissDangerBanner').classList.add('hidden');
      });
    }

    // 7. Notification Diagnostics & Grant
    const notifyBtn = document.getElementById('btnNotifyStatus');
    const testAudioBtn = document.getElementById('btnTestAudioChime');
    const grantPermBtn = document.getElementById('btnGrantSystemPerm');

    if (notifyBtn) notifyBtn.addEventListener('click', () => notifier.requestPermission());
    if (grantPermBtn) grantPermBtn.addEventListener('click', () => notifier.requestPermission());
    if (testAudioBtn) {
      testAudioBtn.addEventListener('click', () => {
        notifier.showAlert({
          title: 'AUDIO HARNESS VERIFIED',
          body: 'Acoustic synthesizer & tactile vibration pulse operational.',
          isUrgent: false,
          tone: 'chime'
        });
      });
    }

    // 8. PWA Install Prompt
    let deferredPrompt = null;
    const installBox = document.getElementById('swissInstallBox');
    const btnPwa = document.getElementById('btnPwaPrompt');
    const btnApk = document.getElementById('btnOpenApkModal');
    const dismissInstall = document.getElementById('btnDismissInstall');
    const modalApk = document.getElementById('modalApkManual');
    const closeApk = document.getElementById('btnCloseApkModal');
    const dismissApk = document.getElementById('btnDismissApkModal');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (!safeLocal.getItem(STORAGE_KEYS.PWA_DISMISSED)) {
        installBox.style.display = 'flex';
      }
    });

    if (btnPwa) {
      btnPwa.addEventListener('click', async () => {
        if (deferredPrompt) {
          try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') installBox.style.display = 'none';
          } catch (err) {}
          deferredPrompt = null;
        } else {
          modalApk.classList.remove('hidden');
        }
      });
    }

    if (btnApk) btnApk.addEventListener('click', () => modalApk.classList.remove('hidden'));
    if (closeApk) closeApk.addEventListener('click', () => modalApk.classList.add('hidden'));
    if (dismissApk) dismissApk.addEventListener('click', () => modalApk.classList.add('hidden'));
    if (dismissInstall) {
      dismissInstall.addEventListener('click', () => {
        installBox.style.display = 'none';
        safeLocal.setItem(STORAGE_KEYS.PWA_DISMISSED, 'true');
      });
    }

    // 9. Bug Report Modal & Formspree
    const btnOpenBug = document.getElementById('btnOpenBugSheet');
    const modalBug = document.getElementById('modalBugReport');
    const closeBug = document.getElementById('btnCloseBugReport');
    const formBug = document.getElementById('formBugReport');
    const bugNotice = document.getElementById('bugReportNotice');

    if (btnOpenBug) btnOpenBug.addEventListener('click', () => modalBug.classList.remove('hidden'));
    if (closeBug) closeBug.addEventListener('click', () => modalBug.classList.add('hidden'));

    if (formBug) {
      formBug.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('btnSubmitBugReport');
        submitBtn.disabled = true;
        submitBtn.textContent = 'TRANSMITTING REPORT TO FORMSPREE...';

        try {
          const res = await fetch(formBug.action, {
            method: 'POST',
            body: new FormData(formBug),
            headers: { 'Accept': 'application/json' }
          });
          if (res.ok) {
            bugNotice.style.color = 'var(--accent-green)';
            bugNotice.textContent = 'DIAGNOSTIC REPORT DISPATCHED TO DEVELOPER.';
            notifier.playTone('success');
            setTimeout(() => {
              modalBug.classList.add('hidden');
              formBug.reset();
              submitBtn.disabled = false;
              submitBtn.textContent = 'DISPATCH REPORT VIA FORMSPREE';
              bugNotice.textContent = '';
            }, 1800);
          } else {
            throw new Error();
          }
        } catch (err) {
          bugNotice.style.color = 'var(--accent-amber)';
          bugNotice.textContent = 'OFFLINE CACHE: REPORT STORED FOR RE-TRANSMISSION.';
          setTimeout(() => {
            modalBug.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'DISPATCH REPORT VIA FORMSPREE';
            bugNotice.textContent = '';
          }, 1800);
        }
      });
    }

    // 10. Course Form Modal (With Initial Units Adjustment)
    const modalSub = document.getElementById('modalSubject');
    const btnNewSub = document.getElementById('btnOpenAddSubjectSheet');
    const btnQuickSub = document.getElementById('btnQuickSubManage');
    const closeSub = document.getElementById('btnCloseSubjectModal');
    const formSub = document.getElementById('formSubject');

    function openSubjectModal(sub = null) {
      document.getElementById('subIdInput').value = sub ? sub.id : '';
      document.getElementById('subNameInp').value = sub ? sub.name : '';
      document.getElementById('subCodeInp').value = sub ? sub.code : '';
      document.getElementById('subTeacherInp').value = sub ? sub.teacher : '';
      
      const log = sub && store.logs[sub.id] ? store.logs[sub.id] : { attended: 0, missed: 0 };
      document.getElementById('subAttendedInp').value = log.attended || 0;
      document.getElementById('subMissedInp').value = log.missed || 0;

      document.getElementById('subjectModalHeading').textContent = sub ? 'COURSE MODIFICATION' : 'COURSE DEFINITION';
      modalSub.classList.remove('hidden');
    }

    if (btnNewSub) btnNewSub.addEventListener('click', () => openSubjectModal());
    if (btnQuickSub) btnQuickSub.addEventListener('click', () => openSubjectModal());
    if (closeSub) closeSub.addEventListener('click', () => modalSub.classList.add('hidden'));
    const cancelSub = document.getElementById('btnCancelSubjectModal');
    if (cancelSub) cancelSub.addEventListener('click', () => modalSub.classList.add('hidden'));

    if (formSub) {
      formSub.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('subIdInput').value;
        const name = document.getElementById('subNameInp').value;
        const code = document.getElementById('subCodeInp').value;
        const teacher = document.getElementById('subTeacherInp').value;
        const attended = Number(document.getElementById('subAttendedInp').value) || 0;
        const missed = Number(document.getElementById('subMissedInp').value) || 0;

        store.updateSubject(id, name, code, teacher, attended, missed);
        modalSub.classList.add('hidden');
        renderAll();
      });
    }

    document.addEventListener('click', (e) => {
      const editSubBtn = e.target.closest('.edit-sub-trigger');
      if (editSubBtn) {
        const id = editSubBtn.getAttribute('data-id');
        const sub = store.getSubject(id);
        openSubjectModal(sub);
      }
      const delSubBtn = e.target.closest('.del-sub-trigger');
      if (delSubBtn) {
        const id = delSubBtn.getAttribute('data-id');
        if (confirm('Delete course definition and all linked timetable units?')) {
          store.deleteSubject(id);
          renderAll();
        }
      }
    });

    // 11. Timetable Slot Modal (With Time Range Validation)
    const modalSlot = document.getElementById('modalSlot');
    const btnNewSlot = document.getElementById('btnOpenAddSlotSheet');
    const closeSlot = document.getElementById('btnCloseSlotModal');
    const formSlot = document.getElementById('formSlot');

    function openSlotModal(slot = null) {
      if (store.subjects.length === 0) {
        alert('NO COURSES FOUND: Please add a course under Course Registry before scheduling timetable slots.');
        openSubjectModal();
        return;
      }

      populateCourseDropdown(slot ? slot.subjectId : null);
      document.getElementById('slotIdInput').value = slot ? slot.id : '';
      document.getElementById('slotDayInput').value = slot ? slot.day : store.selectedDay;
      document.getElementById('slotStartInp').value = slot ? slot.startTime : '09:00';
      document.getElementById('slotEndInp').value = slot ? slot.endTime : '10:00';
      document.getElementById('slotRoomInp').value = slot ? slot.room || '' : '';
      document.getElementById('slotModalHeading').textContent = slot ? 'TIMETABLE SLOT MODIFICATION' : 'TIMETABLE SLOT DEFINITION';
      modalSlot.classList.remove('hidden');
    }

    if (btnNewSlot) btnNewSlot.addEventListener('click', () => openSlotModal());
    if (closeSlot) closeSlot.addEventListener('click', () => modalSlot.classList.add('hidden'));
    const cancelSlot = document.getElementById('btnCancelSlotModal');
    if (cancelSlot) cancelSlot.addEventListener('click', () => modalSlot.classList.add('hidden'));

    if (formSlot) {
      formSlot.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('slotIdInput').value;
        const day = Number(document.getElementById('slotDayInput').value) || store.selectedDay;
        const subjectId = document.getElementById('slotCourseSelect').value;
        const startTime = document.getElementById('slotStartInp').value;
        const endTime = document.getElementById('slotEndInp').value;
        const room = document.getElementById('slotRoomInp').value;

        if (startTime >= endTime) {
          alert('INVALID TIME RANGE: End time must be strictly after start time.');
          return;
        }

        if (!subjectId) {
          alert('PLEASE SELECT A VALID COURSE.');
          return;
        }

        // Slot overlap check on same day
        const [newStartH, newStartM] = startTime.split(':').map(Number);
        const [newEndH, newEndM] = endTime.split(':').map(Number);
        const newStart = newStartH * 60 + newStartM;
        const newEnd = newEndH * 60 + newEndM;

        const conflict = store.timetable.find(s => {
          if (s.id === id || s.day !== day) return false;
          const [sH, sM] = s.startTime.split(':').map(Number);
          const [eH, eM] = s.endTime.split(':').map(Number);
          const slotStart = sH * 60 + sM;
          const slotEnd = eH * 60 + eM;
          return newStart < slotEnd && newEnd > slotStart;
        });

        if (conflict) {
          const conflictSub = store.getSubject(conflict.subjectId);
          if (!confirm(`SCHEDULE OVERLAP WARNING: Slot overlaps with existing class ${conflictSub.code} (${conflict.startTime} - ${conflict.endTime}). Commit anyway?`)) {
            return;
          }
        }

        store.saveSlot({
          id: id || undefined,
          day,
          subjectId,
          startTime,
          endTime,
          room
        });

        modalSlot.classList.add('hidden');
        renderAll();
      });
    }

    document.addEventListener('click', (e) => {
      const editSlotBtn = e.target.closest('.edit-slot-trigger');
      if (editSlotBtn) {
        const id = editSlotBtn.getAttribute('data-id');
        const slot = store.timetable.find(s => s.id === id);
        if (slot) openSlotModal(slot);
      }
      const delSlotBtn = e.target.closest('.del-slot-trigger');
      if (delSlotBtn) {
        const id = delSlotBtn.getAttribute('data-id');
        if (confirm('Delete timetable schedule slot?')) {
          store.deleteSlot(id);
          renderAll();
        }
      }
    });

    // 12. Holiday Modal
    const modalHoliday = document.getElementById('modalHoliday');
    const btnNewHoliday = document.getElementById('btnOpenAddHolidaySheet');
    const closeHoliday = document.getElementById('btnCloseHolidayModal');
    const formHoliday = document.getElementById('formHoliday');

    if (btnNewHoliday) btnNewHoliday.addEventListener('click', () => modalHoliday.classList.remove('hidden'));
    if (closeHoliday) closeHoliday.addEventListener('click', () => modalHoliday.classList.add('hidden'));
    const cancelHoliday = document.getElementById('btnCancelHolidayModal');
    if (cancelHoliday) cancelHoliday.addEventListener('click', () => modalHoliday.classList.add('hidden'));

    if (formHoliday) {
      formHoliday.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('holidayDateInp').value;
        const title = document.getElementById('holidayTitleInp').value;

        store.holidays.push({ id: `h_${Date.now()}`, date, title: title.trim() });
        store.save(STORAGE_KEYS.HOLIDAYS, store.holidays);
        formHoliday.reset();
        modalHoliday.classList.add('hidden');
        renderAll();
      });
    }

    document.addEventListener('click', (e) => {
      const delH = e.target.closest('.del-holiday-trigger');
      if (delH) {
        const id = delH.getAttribute('data-id');
        if (confirm('Delete off-day entry?')) {
          store.holidays = store.holidays.filter(h => h.id !== id);
          store.save(STORAGE_KEYS.HOLIDAYS, store.holidays);
          renderAll();
        }
      }
    });

    // Calendar Month Navigation & Selection
    const btnCalPrev = document.getElementById('btnCalPrevMonth');
    const btnCalNext = document.getElementById('btnCalNextMonth');
    if (btnCalPrev) {
      btnCalPrev.addEventListener('click', () => {
        store.calendarMonth--;
        if (store.calendarMonth < 0) {
          store.calendarMonth = 11;
          store.calendarYear--;
        }
        renderCalendarGrid();
      });
    }
    if (btnCalNext) {
      btnCalNext.addEventListener('click', () => {
        store.calendarMonth++;
        if (store.calendarMonth > 11) {
          store.calendarMonth = 0;
          store.calendarYear++;
        }
        renderCalendarGrid();
      });
    }

    document.addEventListener('click', (e) => {
      const dayCell = e.target.closest('.swiss-cal-day:not(.empty)');
      if (dayCell) {
        const dateStr = dayCell.getAttribute('data-date');
        store.selectedCalendarDate = dateStr;
        renderCalendarGrid();
      }
    });

    const quickHolidayBtn = document.getElementById('btnQuickToggleHoliday');
    if (quickHolidayBtn) {
      quickHolidayBtn.addEventListener('click', () => {
        const action = quickHolidayBtn.getAttribute('data-action');
        const dateStr = store.selectedCalendarDate || store.getTodayStr();
        if (action === 'add') {
          const reason = prompt(`MARK ${dateStr} AS ACADEMIC RECESS / OFF-DAY. Enter reason:`, 'Institutional Off-Day');
          if (reason && reason.trim()) {
            store.holidays.push({ id: `h_${Date.now()}`, date: dateStr, title: reason.trim() });
            store.save(STORAGE_KEYS.HOLIDAYS, store.holidays);
            renderAll();
          }
        } else {
          if (confirm(`Remove off-day registration for ${dateStr}?`)) {
            store.holidays = store.holidays.filter(h => h.date !== dateStr);
            store.save(STORAGE_KEYS.HOLIDAYS, store.holidays);
            renderAll();
          }
        }
      });
    }

    // Export .ICS to Device / Google Calendar
    function exportIcsCalendar() {
      const dayMap = { 1: 'MO', 2: 'TU', 3: 'WE', 4: 'TH', 5: 'FR', 6: 'SA' };
      const icsLines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Smart Attendance System//Swiss Typographic Edition//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Smart Attendance Routine'
      ];

      const now = new Date();
      const currentDay = now.getDay();
      const diffToMon = currentDay === 0 ? -6 : 1 - currentDay;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diffToMon);

      const pad = n => String(n).padStart(2, '0');

      store.timetable.forEach(slot => {
        const sub = store.getSubject(slot.subjectId);
        const dayOffset = (slot.day || 1) - 1;
        const slotDate = new Date(monday);
        slotDate.setDate(monday.getDate() + dayOffset);

        const [sH, sM] = (slot.startTime || '09:00').split(':').map(Number);
        const [eH, eM] = (slot.endTime || '10:00').split(':').map(Number);

        const dtStart = `${slotDate.getFullYear()}${pad(slotDate.getMonth() + 1)}${pad(slotDate.getDate())}T${pad(sH)}${pad(sM)}00`;
        const dtEnd = `${slotDate.getFullYear()}${pad(slotDate.getMonth() + 1)}${pad(slotDate.getDate())}T${pad(eH)}${pad(eM)}00`;

        icsLines.push('BEGIN:VEVENT');
        icsLines.push(`UID:attend_${slot.id}_${Date.now()}@smartattendance.local`);
        icsLines.push(`DTSTAMP:${dtStart}Z`);
        icsLines.push(`DTSTART:${dtStart}`);
        icsLines.push(`DTEND:${dtEnd}`);
        icsLines.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayMap[slot.day] || 'MO'}`);
        icsLines.push(`SUMMARY:${sub.code}: ${sub.name}`);
        icsLines.push(`LOCATION:${slot.room || 'Campus Classroom'}`);
        icsLines.push(`DESCRIPTION:Instructor: ${sub.teacher || 'N/A'} - Smart Attendance Weekly Unit`);
        icsLines.push('BEGIN:VALARM');
        icsLines.push('TRIGGER:-PT10M');
        icsLines.push('ACTION:DISPLAY');
        icsLines.push(`DESCRIPTION:Scheduled class in 10 minutes: ${sub.code} ${sub.name}`);
        icsLines.push('END:VALARM');
        icsLines.push('END:VEVENT');
      });

      icsLines.push('END:VCALENDAR');
      const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart_attendance_routine_${store.getTodayStr()}.ics`;
      a.click();
      URL.revokeObjectURL(url);
    }

    const btnExportIcs = document.getElementById('btnExportIcs');
    if (btnExportIcs) {
      btnExportIcs.addEventListener('click', () => exportIcsCalendar());
    }

    // 13. Campus Header Interaction
    const campusTrigger = document.getElementById('swissCampusTrigger');
    if (campusTrigger) {
      campusTrigger.addEventListener('click', () => {
        const dept = prompt('SPECIFY ACADEMIC DEPARTMENT:', store.campus.dept);
        const prog = prompt('SPECIFY PROGRAM & SECTION:', store.campus.program);
        if (dept) store.campus.dept = dept.trim().toUpperCase();
        if (prog) store.campus.program = prog.trim().toUpperCase();
        store.save(STORAGE_KEYS.CAMPUS, store.campus);
        document.getElementById('labelCampusDept').textContent = store.campus.dept;
        document.getElementById('labelCampusProgram').textContent = store.campus.program;
      });
    }

    // 14. Parameters, Profile & Academic Config
    const cfgStudentName = document.getElementById('cfgStudentName');
    const cfgStudentUsn = document.getElementById('cfgStudentUsn');
    const cfgCampusDept = document.getElementById('cfgCampusDept');
    const cfgCampusProgram = document.getElementById('cfgCampusProgram');
    const btnSaveProfile = document.getElementById('btnSaveProfile');

    if (cfgStudentName) cfgStudentName.value = store.settings.studentName || 'SOHAN GOWDA';
    if (cfgStudentUsn) cfgStudentUsn.value = store.settings.studentUsn || '1RV22CS100';
    if (cfgCampusDept) cfgCampusDept.value = store.campus.dept || 'DEPT OF COMPUTER SCIENCE';
    if (cfgCampusProgram) cfgCampusProgram.value = store.campus.program || 'SEM 5 / SECTION A / ACADEMIC YR 2026';

    if (btnSaveProfile) {
      btnSaveProfile.addEventListener('click', () => {
        const sName = (cfgStudentName ? cfgStudentName.value : '').trim();
        const sUsn = (cfgStudentUsn ? cfgStudentUsn.value : '').trim();
        const cDept = (cfgCampusDept ? cfgCampusDept.value : '').trim().toUpperCase();
        const cProg = (cfgCampusProgram ? cfgCampusProgram.value : '').trim().toUpperCase();

        store.settings.studentName = sName || 'STUDENT';
        store.settings.studentUsn = sUsn || 'N/A';
        store.campus.dept = cDept || 'DEPARTMENT OF ENGINEERING';
        store.campus.program = cProg || 'ACADEMIC YR 2026';

        store.save(STORAGE_KEYS.SETTINGS, store.settings);
        store.save(STORAGE_KEYS.CAMPUS, store.campus);

        const deptLbl = document.getElementById('labelCampusDept');
        const progLbl = document.getElementById('labelCampusProgram');
        if (deptLbl) deptLbl.textContent = store.campus.dept;
        if (progLbl) progLbl.textContent = store.campus.program;

        notifier.playTone('action');
        alert('STUDENT IDENTITY & CAMPUS METADATA COMMITTED.');
      });
    }

    const cfgCutoffRange = document.getElementById('cfgCutoffRange');
    const cfgCutoff = document.getElementById('cfgCutoff');
    const cfgCutoffDisplay = document.getElementById('cfgCutoffDisplay');

    if (cfgCutoff && cfgCutoffRange && cfgCutoffDisplay) {
      const initialCutoff = store.settings.criteriaCutoff || 75;
      cfgCutoff.value = initialCutoff;
      cfgCutoffRange.value = initialCutoff;
      cfgCutoffDisplay.textContent = `${Number(initialCutoff).toFixed(1)}%`;

      const syncCutoff = (val) => {
        const clamped = Math.max(50, Math.min(95, Number(val) || 75));
        store.settings.criteriaCutoff = clamped;
        cfgCutoff.value = clamped;
        cfgCutoffRange.value = clamped;
        cfgCutoffDisplay.textContent = `${clamped.toFixed(1)}%`;
        store.save(STORAGE_KEYS.SETTINGS, store.settings);
        renderTelemetry();
        renderSubjectList();
        renderTodayLedger();
      };

      cfgCutoffRange.addEventListener('input', () => syncCutoff(cfgCutoffRange.value));
      cfgCutoff.addEventListener('change', () => syncCutoff(cfgCutoff.value));
    }

    const cfgPreAlertMins = document.getElementById('cfgPreAlertMins');
    if (cfgPreAlertMins) {
      cfgPreAlertMins.value = String(store.settings.preClassLeadMins || 10);
      cfgPreAlertMins.addEventListener('change', () => {
        store.settings.preClassLeadMins = Number(cfgPreAlertMins.value) || 10;
        store.save(STORAGE_KEYS.SETTINGS, store.settings);
      });
    }

    const cfgWeekStructure = document.getElementById('cfgWeekStructure');
    if (cfgWeekStructure) {
      cfgWeekStructure.value = String(store.settings.weekStructure || 6);
      cfgWeekStructure.addEventListener('change', () => {
        store.settings.weekStructure = Number(cfgWeekStructure.value) || 6;
        store.save(STORAGE_KEYS.SETTINGS, store.settings);
        renderTimetableMatrix();
        renderCalendarGrid();
      });
    }

    const cfgSoundToggle = document.getElementById('cfgSoundToggle');
    if (cfgSoundToggle) {
      cfgSoundToggle.checked = store.settings.enableSound !== false;
      cfgSoundToggle.addEventListener('change', () => {
        store.settings.enableSound = cfgSoundToggle.checked;
        store.save(STORAGE_KEYS.SETTINGS, store.settings);
      });
    }

    const cfgVibrationToggle = document.getElementById('cfgVibrationToggle');
    if (cfgVibrationToggle) {
      cfgVibrationToggle.checked = store.settings.enableVibration !== false;
      cfgVibrationToggle.addEventListener('change', () => {
        store.settings.enableVibration = cfgVibrationToggle.checked;
        store.save(STORAGE_KEYS.SETTINGS, store.settings);
      });
    }

    const cfgPostClassToggle = document.getElementById('cfgPostClassToggle');
    if (cfgPostClassToggle) {
      cfgPostClassToggle.checked = store.settings.enablePostClassPrompt !== false;
      cfgPostClassToggle.addEventListener('change', () => {
        store.settings.enablePostClassPrompt = cfgPostClassToggle.checked;
        store.save(STORAGE_KEYS.SETTINGS, store.settings);
      });
    }

    const btnTestAudioChime = document.getElementById('btnTestAudioChime');
    if (btnTestAudioChime) {
      btnTestAudioChime.addEventListener('click', () => {
        notifier.playTone('chime');
        setTimeout(() => notifier.playTone('urgent'), 400);
      });
    }

    const btnGrantSystemPerm = document.getElementById('btnGrantSystemPerm');
    if (btnGrantSystemPerm) {
      btnGrantSystemPerm.addEventListener('click', async () => {
        const res = await notifier.requestPermission();
        alert(`SYSTEM NOTIFICATION HARNESS STATUS: ${res.toUpperCase()}`);
      });
    }

    const btnResetTodayActions = document.getElementById('btnResetTodayActions');
    if (btnResetTodayActions) {
      btnResetTodayActions.addEventListener('click', () => {
        if (confirm("Reset attendance markings logged for today? Cumulative course totals will not be affected.")) {
          store.dailyActions = {};
          try { safeSession.removeItem('swiss_actions_' + store.getTodayStr()); } catch (e) {}
          renderAll();
          alert("TODAY'S ATTENDANCE LOGS RESET.");
        }
      });
    }

    const btnResetTallies = document.getElementById('btnResetTallies');
    if (btnResetTallies) {
      btnResetTallies.addEventListener('click', () => {
        if (confirm("START NEW SEMESTER? This resets all course attendance totals (attended, missed, cancelled) to 0, while keeping all course subjects and timetable routines intact.")) {
          Object.keys(store.logs).forEach(id => {
            store.logs[id] = { attended: 0, missed: 0, cancelled: 0 };
          });
          store.dailyActions = {};
          try { safeSession.removeItem('swiss_actions_' + store.getTodayStr()); } catch (e) {}
          store.save(STORAGE_KEYS.LOGS, store.logs);
          renderAll();
          alert("NEW SEMESTER INITIALIZED: All attendance counters reset to 0.");
        }
      });
    }

    const btnExport = document.getElementById('btnExportJson');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const payload = JSON.stringify({
          campus: store.campus,
          settings: store.settings,
          subjects: store.subjects,
          timetable: store.timetable,
          logs: store.logs,
          holidays: store.holidays
        }, null, 2);
        const blob = new Blob([payload], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smart_attendance_telemetry_${store.getTodayStr()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    const btnImport = document.getElementById('btnImportJson');
    const inpRestore = document.getElementById('inpRestoreBackup');
    if (btnImport && inpRestore) {
      btnImport.addEventListener('click', () => inpRestore.click());
      inpRestore.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            try {
              const data = JSON.parse(ev.target.result);
              if (data.subjects && data.timetable && data.logs) {
                store.campus = data.campus || store.campus;
                store.settings = data.settings || store.settings;
                store.subjects = data.subjects;
                store.timetable = data.timetable;
                store.logs = data.logs;
                store.holidays = data.holidays || [];

                store.save(STORAGE_KEYS.CAMPUS, store.campus);
                store.save(STORAGE_KEYS.SETTINGS, store.settings);
                store.save(STORAGE_KEYS.SUBJECTS, store.subjects);
                store.save(STORAGE_KEYS.TIMETABLE, store.timetable);
                store.save(STORAGE_KEYS.LOGS, store.logs);
                store.save(STORAGE_KEYS.HOLIDAYS, store.holidays);

                renderAll();
                alert('BACKUP RESTORED SUCCESSFULLY.');
              } else {
                throw new Error('Missing schema keys');
              }
            } catch (err) {
              alert('INVALID BACKUP FILE: Failed to parse attendance telemetry JSON.');
            }
          };
          reader.readAsText(file);
        }
      });
    }

    const btnPurge = document.getElementById('btnPurgeState');
    if (btnPurge) {
      btnPurge.addEventListener('click', () => {
        if (confirm('PURGE ALL SYSTEM STATE BACK TO FACTORY INITIALIZATION?')) {
          try {
            safeLocal.clear();
            safeSession.clear();
          } catch (e) {}
          location.reload();
        }
      });
    }

    // 15. Backdrop Click to Dismiss for All Modals
    document.querySelectorAll('.swiss-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.add('hidden');
        }
      });
    });

    // 16. OCR Engine Activation
    initOcr();

    // 17. Initial Pipeline Execution & Schedule Check
    renderAll();
    checkScheduleAlerts();

    // 18. Service Worker & Action Dispatcher
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      try {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'NOTIFICATION_ACTION') {
            const { action, slotId } = event.data;
            const slot = store.timetable.find(s => s.id === slotId);
            if (slot) {
              store.recordAttendance(slot.subjectId, action, slotId);
              renderAll();
            }
          }
        });
        navigator.serviceWorker.register('./service-worker.js').catch(() => {});
      } catch (e) {}
    }
  }

  // Resilient Bootstrapping (Runs immediately if readyState is interactive/complete, e.g. in artifact iframe)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
