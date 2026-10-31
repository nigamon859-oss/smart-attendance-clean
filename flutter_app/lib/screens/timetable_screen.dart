import 'package:flutter/material.dart';
import '../models/subject.dart';
import '../models/timetable_slot.dart';
import '../theme/swiss_theme.dart';

class TimetableScreen extends StatefulWidget {
  final List<Subject> subjects;
  final List<TimetableSlot> timetable;
  final Function(TimetableSlot) onAddSlot;
  final Function(String slotId) onDeleteSlot;
  final Function(Subject) onAddSubject;
  final Function(String subjectId) onDeleteSubject;

  const TimetableScreen({
    super.key,
    required this.subjects,
    required this.timetable,
    required this.onAddSlot,
    required this.onDeleteSlot,
    required this.onAddSubject,
    required this.onDeleteSubject,
  });

  @override
  State<TimetableScreen> createState() => _TimetableScreenState();
}

class _TimetableScreenState extends State<TimetableScreen> {
  int _selectedDay = 1;

  final List<String> _dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  void _showAddSlotDialog() {
    if (widget.subjects.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('NO COURSES FOUND: Create a course code first.')),
      );
      return;
    }

    String selectedSubId = widget.subjects.first.id;
    String startTime = '09:00';
    String endTime = '10:00';
    String room = 'HALL 101';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          backgroundColor: Theme.of(context).brightness == Brightness.dark
              ? SwissColors.surface0Dark
              : SwissColors.surface0Light,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
          title: const Text(
            'TIMETABLE SLOT DEFINITION',
            style: TextStyle(fontFamily: 'monospace', fontSize: 12, fontWeight: FontWeight.w900),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                value: selectedSubId,
                decoration: const InputDecoration(labelText: 'COURSE CODE', isDense: true),
                items: widget.subjects
                    .map((s) => DropdownMenuItem(
                          value: s.id,
                          child: Text('${s.code} - ${s.name}', style: const TextStyle(fontSize: 12)),
                        ))
                    .toList(),
                onChanged: (val) {
                  if (val != null) setDialogState(() => selectedSubId = val);
                },
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      initialValue: startTime,
                      decoration: const InputDecoration(labelText: 'START TIME', isDense: true),
                      onChanged: (val) => startTime = val,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextFormField(
                      initialValue: endTime,
                      decoration: const InputDecoration(labelText: 'END TIME', isDense: true),
                      onChanged: (val) => endTime = val,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              TextFormField(
                initialValue: room,
                decoration: const InputDecoration(labelText: 'ROOM / FACILITY', isDense: true),
                onChanged: (val) => room = val,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('CANCEL', style: TextStyle(fontFamily: 'monospace', fontSize: 11)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).brightness == Brightness.dark
                    ? Colors.white
                    : SwissColors.obsidian,
                foregroundColor: Theme.of(context).brightness == Brightness.dark
                    ? SwissColors.obsidian
                    : Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(3)),
              ),
              onPressed: () {
                widget.onAddSlot(TimetableSlot(
                  id: 'slot_${DateTime.now().millisecondsSinceEpoch}',
                  day: _selectedDay,
                  subjectId: selectedSubId,
                  startTime: startTime,
                  endTime: endTime,
                  room: room,
                ));
                Navigator.pop(ctx);
              },
              child: const Text('COMMIT SLOT', style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w800)),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddSubjectDialog() {
    String name = '';
    String code = '';
    String teacher = '';
    int initialAttended = 0;
    int initialMissed = 0;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Theme.of(context).brightness == Brightness.dark
            ? SwissColors.surface0Dark
            : SwissColors.surface0Light,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
        title: const Text(
          'COURSE CODE DEFINITION',
          style: TextStyle(fontFamily: 'monospace', fontSize: 12, fontWeight: FontWeight.w900),
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                decoration: const InputDecoration(labelText: 'COURSE TITLE', isDense: true),
                onChanged: (val) => name = val,
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      decoration: const InputDecoration(labelText: 'CODE (e.g. CS201)', isDense: true),
                      onChanged: (val) => code = val,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextFormField(
                      decoration: const InputDecoration(labelText: 'INSTRUCTOR', isDense: true),
                      onChanged: (val) => teacher = val,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'ATTENDED UNITS', isDense: true),
                      onChanged: (val) => initialAttended = int.tryParse(val) ?? 0,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextFormField(
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'MISSED UNITS', isDense: true),
                      onChanged: (val) => initialMissed = int.tryParse(val) ?? 0,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('CANCEL', style: TextStyle(fontFamily: 'monospace', fontSize: 11)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).brightness == Brightness.dark
                  ? Colors.white
                  : SwissColors.obsidian,
              foregroundColor: Theme.of(context).brightness == Brightness.dark
                  ? SwissColors.obsidian
                  : Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(3)),
            ),
            onPressed: () {
              if (name.trim().isNotEmpty) {
                widget.onAddSubject(Subject(
                  id: 'sub_${DateTime.now().millisecondsSinceEpoch}',
                  name: name.trim(),
                  code: code.trim().toUpperCase(),
                  teacher: teacher.trim(),
                  attended: initialAttended,
                  missed: initialMissed,
                ));
              }
              Navigator.pop(ctx);
            },
            child: const Text('SAVE COURSE', style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w800)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final daySlots = widget.timetable.where((s) => s.day == _selectedDay).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(14),
      physics: const BouncingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text(
                'TIMETABLE ROUTINE MATRIX',
                style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 0.8),
              ),
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  minimumSize: const Size(60, 30),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(3)),
                ),
                onPressed: _showAddSlotDialog,
                child: const Text('+ ADD SLOT', style: TextStyle(fontFamily: 'monospace', fontSize: 10, fontWeight: FontWeight.w800)),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Day Selector Segment
          Row(
            children: List.generate(6, (idx) {
              final dayNum = idx + 1;
              final isSelected = _selectedDay == dayNum;
              return Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _selectedDay = dayNum),
                  child: Container(
                    margin: EdgeInsets.only(right: idx < 5 ? 4 : 0),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? (isDark ? Colors.white : SwissColors.obsidian)
                          : (isDark ? SwissColors.surface1Dark : SwissColors.surface1Light),
                      borderRadius: BorderRadius.circular(3),
                      border: Border.all(
                        color: isSelected
                            ? (isDark ? Colors.white : SwissColors.obsidian)
                            : (isDark ? SwissColors.borderDark : SwissColors.borderLight),
                      ),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      _dayNames[idx],
                      style: TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: isSelected
                            ? (isDark ? SwissColors.obsidian : Colors.white)
                            : (isDark ? Colors.grey[400] : Colors.grey[800]),
                      ),
                    ),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 14),

          // Slots List
          if (daySlots.isEmpty)
            Container(
              padding: const EdgeInsets.all(24),
              alignment: Alignment.center,
              child: const Text(
                'NO SLOTS REGISTERED FOR SELECTED DAY.',
                style: TextStyle(fontFamily: 'monospace', fontSize: 11, color: Colors.grey),
              ),
            )
          else
            ...daySlots.map((slot) {
              final sub = widget.subjects.firstWhere(
                (s) => s.id == slot.subjectId,
                orElse: () => Subject(id: 'err', name: 'Unknown', code: '---'),
              );

              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isDark ? SwissColors.surface0Dark : SwissColors.surface0Light,
                  borderRadius: BorderRadius.circular(3),
                  border: Border.all(color: isDark ? SwissColors.borderDark : SwissColors.borderLight),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${slot.startTime} — ${slot.endTime} / ${sub.code}',
                            style: const TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w800),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            sub.name,
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'FACILITY: ${slot.room.isNotEmpty ? slot.room : "N/A"} • ${sub.teacher}',
                            style: const TextStyle(fontFamily: 'monospace', fontSize: 10, color: Colors.grey),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete_outline, size: 18, color: SwissColors.accentRed),
                      onPressed: () => widget.onDeleteSlot(slot.id),
                    ),
                  ],
                ),
              );
            }),

          const SizedBox(height: 20),
          const Divider(),
          const SizedBox(height: 10),

          // Course Registry Section
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text(
                'COURSE CODES & SUBJECTS',
                style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 0.8),
              ),
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  minimumSize: const Size(60, 30),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(3)),
                ),
                onPressed: _showAddSubjectDialog,
                child: const Text('+ NEW COURSE', style: TextStyle(fontFamily: 'monospace', fontSize: 10, fontWeight: FontWeight.w800)),
              ),
            ],
          ),
          const SizedBox(height: 10),

          ...widget.subjects.map((sub) => Container(
                margin: const EdgeInsets.only(bottom: 6),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                decoration: BoxDecoration(
                  color: isDark ? SwissColors.surface0Dark : SwissColors.surface0Light,
                  borderRadius: BorderRadius.circular(3),
                  border: Border.all(color: isDark ? SwissColors.borderDark : SwissColors.borderLight),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${sub.code}: ${sub.name}', style: const TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w800)),
                        Text('INSTRUCTOR: ${sub.teacher} • TELEMETRY: ${sub.attended}/${sub.totalConducted} UNITS',
                            style: const TextStyle(fontFamily: 'monospace', fontSize: 10, color: Colors.grey)),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete_outline, size: 18, color: SwissColors.accentRed),
                      onPressed: () => widget.onDeleteSubject(sub.id),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }
}
