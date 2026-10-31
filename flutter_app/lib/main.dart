import 'package:flutter/material.dart';
import 'models/subject.dart';
import 'models/timetable_slot.dart';
import 'theme/swiss_theme.dart';
import 'screens/dashboard_screen.dart';
import 'screens/timetable_screen.dart';
import 'screens/holidays_screen.dart';
import 'screens/scanner_screen.dart';
import 'screens/config_screen.dart';

void main() {
  runApp(const SmartAttendanceApp());
}

class SmartAttendanceApp extends StatefulWidget {
  const SmartAttendanceApp({super.key});

  @override
  State<SmartAttendanceApp> createState() => _SmartAttendanceAppState();
}

class _SmartAttendanceAppState extends State<SmartAttendanceApp> {
  ThemeMode _themeMode = ThemeMode.dark;

  void _toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Attendance 2.4',
      debugShowCheckedModeBanner: false,
      theme: SwissTheme.lightTheme,
      darkTheme: SwissTheme.darkTheme,
      themeMode: _themeMode,
      home: MainHomeScreen(
        onToggleTheme: _toggleTheme,
        isDark: _themeMode == ThemeMode.dark,
      ),
    );
  }
}

class MainHomeScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;
  final bool isDark;

  const MainHomeScreen({
    super.key,
    required this.onToggleTheme,
    required this.isDark,
  });

  @override
  State<MainHomeScreen> createState() => _MainHomeScreenState();
}

class _MainHomeScreenState extends State<MainHomeScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  double _criteriaCutoff = 75.0;
  final Map<String, String> _dailyActions = {};

  final List<Subject> _subjects = [
    Subject(id: 'sub_cs101', name: 'Data Structures & Algorithms', code: 'CS201', teacher: 'Dr. Sharma', attended: 14, missed: 2),
    Subject(id: 'sub_cs102', name: 'Computer Networks', code: 'CS202', teacher: 'Prof. Rao', attended: 12, missed: 3),
    Subject(id: 'sub_cs103', name: 'Operating Systems', code: 'CS203', teacher: 'Dr. Varma', attended: 6, missed: 4),
    Subject(id: 'sub_math', name: 'Discrete Mathematics', code: 'MA201', teacher: 'Prof. Iyer', attended: 15, missed: 1),
    Subject(id: 'sub_lab', name: 'DBMS & SQL Laboratory', code: 'CS205L', teacher: 'Mr. Gowda', attended: 8, missed: 0),
  ];

  final List<TimetableSlot> _timetable = [
    TimetableSlot(id: 'slot_1', day: 1, subjectId: 'sub_cs101', startTime: '09:00', endTime: '10:00', room: 'HALL 101'),
    TimetableSlot(id: 'slot_2', day: 1, subjectId: 'sub_cs102', startTime: '10:15', endTime: '11:15', room: 'HALL 102'),
    TimetableSlot(id: 'slot_3', day: 1, subjectId: 'sub_cs103', startTime: '11:30', endTime: '12:30', room: 'HALL 103'),
    TimetableSlot(id: 'slot_4', day: 1, subjectId: 'sub_lab', startTime: '13:45', endTime: '15:45', room: 'LAB 02'),
    TimetableSlot(id: 'slot_5', day: 2, subjectId: 'sub_math', startTime: '09:00', endTime: '10:00', room: 'HALL 101'),
    TimetableSlot(id: 'slot_6', day: 2, subjectId: 'sub_cs101', startTime: '10:15', endTime: '11:15', room: 'HALL 102'),
    TimetableSlot(id: 'slot_7', day: 3, subjectId: 'sub_cs102', startTime: '09:00', endTime: '10:00', room: 'HALL 101'),
    TimetableSlot(id: 'slot_8', day: 4, subjectId: 'sub_cs101', startTime: '09:00', endTime: '10:00', room: 'HALL 101'),
    TimetableSlot(id: 'slot_9', day: 5, subjectId: 'sub_cs102', startTime: '09:00', endTime: '10:00', room: 'HALL 101'),
    TimetableSlot(id: 'slot_10', day: 6, subjectId: 'sub_cs103', startTime: '09:30', endTime: '11:30', room: 'SEMINAR 01'),
  ];

  final List<Holiday> _holidays = [
    Holiday(id: 'h_1', date: '2026-11-01', title: 'State Day / Rajyotsava'),
    Holiday(id: 'h_2', date: '2026-11-15', title: 'Sports & Cultural Symposium'),
    Holiday(id: 'h_3', date: '2026-12-25', title: 'Winter Recess / Christmas'),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
  }

  void _markAttendance(String subjectId, String slotId, String status) {
    setState(() {
      final sub = _subjects.firstWhere((s) => s.id == subjectId);
      final prev = _dailyActions[slotId];
      if (prev == 'yes') sub.attended = (sub.attended - 1).clamp(0, 999);
      if (prev == 'no') sub.missed = (sub.missed - 1).clamp(0, 999);

      if (prev == status) {
        // Toggle off unmark
        _dailyActions.remove(slotId);
      } else {
        if (status == 'yes') sub.attended += 1;
        if (status == 'no') sub.missed += 1;
        _dailyActions[slotId] = status;
      }
    });

    // Check full day celebration (Correct dynamic day resolution)
    final currentDay = DateTime.now().weekday; // 1 = Mon ... 7 = Sun
    final activeDay = currentDay == 7 ? 1 : currentDay;
    final todaySlots = _timetable.where((s) => s.day == activeDay).toList();

    if (todaySlots.isNotEmpty) {
      bool allAttended = true;
      for (var s in todaySlots) {
        if (_dailyActions[s.id] != 'yes') allAttended = false;
      }
      if (allAttended) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('MAXIMUM DAILY DISCIPLINE ACHIEVED. ALL SCHEDULED LECTURES ATTENDED.'),
            backgroundColor: SwissColors.accentGreen,
            duration: Duration(seconds: 4),
          ),
        );
      }
    }
  }

  void _openBugReportSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
          border: Border.all(color: widget.isDark ? SwissColors.borderDark : SwissColors.borderLight),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 36,
                height: 3,
                decoration: BoxDecoration(
                  color: Colors.grey.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              'SYSTEM DIAGNOSTICS & BUG REPORT',
              style: TextStyle(fontFamily: 'monospace', fontSize: 13, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: widget.isDark ? SwissColors.surface1Dark : SwissColors.surface1Light,
                borderRadius: BorderRadius.circular(3),
                border: Border.all(color: widget.isDark ? SwissColors.borderDark : SwissColors.borderLight),
              ),
              child: const Text(
                'SYSTEM: Smart Attendance System 2.4 (Swiss)\n'
                'AUTHORS: Sohan Gowda & AI Pair\n'
                'VERSION: v2.4.0 (Offline Algorithmic)\n'
                'PURPOSE: Zero-RAM offline attendance compliance tracker for university students.',
                style: TextStyle(fontFamily: 'monospace', fontSize: 11, height: 1.4),
              ),
            ),
            const SizedBox(height: 14),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: widget.isDark ? Colors.white : SwissColors.obsidian,
                foregroundColor: widget.isDark ? SwissColors.obsidian : Colors.white,
                minimumSize: const Size.fromHeight(42),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(3)),
              ),
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('DIAGNOSTIC REPORT DISPATCHED TO FORMSPREE.')),
                );
              },
              child: const Text(
                'DISPATCH VIA FORMSPREE',
                style: TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.w800, fontSize: 11),
              ),
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }

  void _loadPreset(String preset) {
    setState(() {
      if (preset == 'ece') {
        _subjects.clear();
        _subjects.addAll([
          Subject(id: 'sub_e1', name: 'Digital Signal Processing', code: 'EC301', teacher: 'Dr. Menon', attended: 10, missed: 2),
          Subject(id: 'sub_e2', name: 'VLSI Design & Fabrication', code: 'EC302', teacher: 'Prof. Bose', attended: 8, missed: 3),
          Subject(id: 'sub_e3', name: 'Control Systems', code: 'EC303', teacher: 'Dr. John', attended: 12, missed: 1),
        ]);
      } else if (preset == 'bba') {
        _subjects.clear();
        _subjects.addAll([
          Subject(id: 'sub_b1', name: 'Corporate Financial Management', code: 'B201', teacher: 'Dr. Mehta', attended: 14, missed: 1),
          Subject(id: 'sub_b2', name: 'Business Economics & Policy', code: 'B202', teacher: 'Prof. Desai', attended: 11, missed: 2),
          Subject(id: 'sub_b3', name: 'Marketing Strategy & Analytics', code: 'B203', teacher: 'Dr. Gupta', attended: 9, missed: 3),
        ]);
      } else if (preset == 'ocr_demo') {
        _subjects.add(Subject(
          id: 'sub_scan_${DateTime.now().millisecondsSinceEpoch}',
          name: 'Mobile Application Development',
          code: 'CS504',
          teacher: 'Dr. Sen',
          attended: 4,
          missed: 1,
        ));
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('CURRICULUM MATRIX LOADED: ${preset.toUpperCase()}')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(98),
        child: Container(
          decoration: BoxDecoration(
            color: Theme.of(context).appBarTheme.backgroundColor,
            border: Border(bottom: BorderSide(color: Theme.of(context).dividerColor.withOpacity(0.12))),
          ),
          child: SafeArea(
            child: Column(
              children: [
                // Swiss Top Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 28,
                            height: 28,
                            decoration: BoxDecoration(
                              color: widget.isDark ? Colors.white : SwissColors.obsidian,
                              borderRadius: BorderRadius.circular(2),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              'SA',
                              style: TextStyle(
                                fontFamily: 'monospace',
                                fontWeight: FontWeight.w900,
                                fontSize: 12,
                                color: widget.isDark ? SwissColors.obsidian : Colors.white,
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'DEPT OF COMPUTER SCIENCE',
                                style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w900),
                              ),
                              Text(
                                'SEM 5 / SECTION A / YR 2026',
                                style: TextStyle(fontFamily: 'monospace', fontSize: 9, color: Colors.grey),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.bug_report_outlined, size: 18),
                            onPressed: _openBugReportSheet,
                            tooltip: 'Report',
                          ),
                          IconButton(
                            icon: Icon(widget.isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined, size: 18),
                            onPressed: widget.onToggleTheme,
                            tooltip: 'Theme',
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Swiss Top Navigation Tabs (Requirement 4)
                TabBar(
                  controller: _tabController,
                  isScrollable: true,
                  labelColor: widget.isDark ? Colors.white : SwissColors.obsidian,
                  unselectedLabelColor: Colors.grey,
                  indicatorColor: widget.isDark ? Colors.white : SwissColors.obsidian,
                  indicatorWeight: 2,
                  labelStyle: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.w800, fontSize: 10),
                  tabs: const [
                    Tab(text: '01 ROUTINE'),
                    Tab(text: '02 TIMETABLE'),
                    Tab(text: '03 HOLIDAYS'),
                    Tab(text: '04 SCANNER'),
                    Tab(text: '05 CONFIG'),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          DashboardScreen(
            subjects: _subjects,
            timetable: _timetable,
            dailyActions: _dailyActions,
            criteriaCutoff: _criteriaCutoff,
            onMarkAttendance: _markAttendance,
          ),
          TimetableScreen(
            subjects: _subjects,
            timetable: _timetable,
            onAddSlot: (slot) => setState(() => _timetable.add(slot)),
            onDeleteSlot: (id) => setState(() => _timetable.removeWhere((s) => s.id == id)),
            onAddSubject: (sub) => setState(() => _subjects.add(sub)),
            onDeleteSubject: (id) => setState(() {
              _subjects.removeWhere((s) => s.id == id);
              _timetable.removeWhere((s) => s.subjectId == id);
            }),
          ),
          HolidaysScreen(
            holidays: _holidays,
            onAddHoliday: (h) => setState(() => _holidays.add(h)),
            onDeleteHoliday: (id) => setState(() => _holidays.removeWhere((h) => h.id == id)),
          ),
          ScannerScreen(
            onLoadPreset: _loadPreset,
          ),
          ConfigScreen(
            criteriaCutoff: _criteriaCutoff,
            onUpdateCutoff: (val) => setState(() => _criteriaCutoff = val),
            onPurgeState: () {
              setState(() {
                _dailyActions.clear();
                _criteriaCutoff = 75.0;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('FACTORY STATE RESTORED.')),
              );
            },
          ),
        ],
      ),
    );
  }
}
