import 'package:flutter/material.dart';
import '../models/subject.dart';
import '../models/timetable_slot.dart';
import '../theme/swiss_theme.dart';
import '../widgets/telemetry_card.dart';

class DashboardScreen extends StatelessWidget {
  final List<Subject> subjects;
  final List<TimetableSlot> timetable;
  final Map<String, String> dailyActions;
  final double criteriaCutoff;
  final Function(String subjectId, String slotId, String status) onMarkAttendance;

  const DashboardScreen({
    super.key,
    required this.subjects,
    required this.timetable,
    required this.dailyActions,
    required this.criteriaCutoff,
    required this.onMarkAttendance,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    int totalAttended = 0;
    int totalMissed = 0;
    for (var s in subjects) {
      totalAttended += s.attended;
      totalMissed += s.missed;
    }
    final totalConducted = totalAttended + totalMissed;
    final overallPercentage = totalConducted == 0 ? 100.0 : (totalAttended / totalConducted) * 100;
    final isSafe = overallPercentage >= criteriaCutoff;

    int safeBunks = 0;
    int recovery = 0;
    if (isSafe) {
      final val = ((totalAttended * 100) - (criteriaCutoff * totalConducted)) / criteriaCutoff;
      safeBunks = val.floor() > 0 ? val.floor() : 0;
    } else {
      final denom = (100 - criteriaCutoff) <= 0 ? 1.0 : (100 - criteriaCutoff);
      final val = ((criteriaCutoff * totalConducted) - (100 * totalAttended)) / denom;
      recovery = val.ceil() > 0 ? val.ceil() : 0;
    }

    final currentDay = DateTime.now().weekday; // 1 = Mon ... 7 = Sun
    final activeDay = currentDay == 7 ? 1 : currentDay;
    final todaySlots = timetable.where((s) => s.day == activeDay).toList();

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Swiss Telemetry Card
          TelemetryCard(
            overallPercentage: overallPercentage,
            totalAttended: totalAttended,
            totalConducted: totalConducted,
            safeBunks: safeBunks,
            recoveryRequired: recovery,
            isSafe: isSafe,
            cutoff: criteriaCutoff,
          ),

          // 2. Course Telemetry Strip (No emojis, clean monospace tiles)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: isDark ? SwissColors.surface0Dark : SwissColors.surface0Light,
              border: Border(
                bottom: BorderSide(
                  color: isDark ? SwissColors.borderDark : SwissColors.borderLight,
                ),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'SUBJECT REGISTRY TELEMETRY',
                  style: TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.8,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  height: 64,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: subjects.length,
                    itemBuilder: (context, idx) {
                      final s = subjects[idx];
                      final safe = s.isSafe(criteriaCutoff);
                      return Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: isDark ? SwissColors.surface1Dark : SwissColors.surface1Light,
                          border: Border.all(
                            color: isDark ? SwissColors.borderDark : SwissColors.borderLight,
                          ),
                          borderRadius: BorderRadius.circular(3),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              s.code,
                              style: TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: isDark ? Colors.white : SwissColors.obsidian,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${s.percentage.toStringAsFixed(1)}%',
                              style: TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 11,
                                fontWeight: FontWeight.w900,
                                color: safe ? SwissColors.accentGreen : SwissColors.accentRed,
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // 3. Today's Schedule Ledger
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text(
                      'TODAY\'S SCHEDULE LEDGER',
                      style: TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                        color: Colors.grey,
                      ),
                    ),
                    Text(
                      'DAY 0$activeDay',
                      style: const TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: SwissColors.accentGreen,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                if (todaySlots.isEmpty)
                  Container(
                    padding: const EdgeInsets.all(24),
                    alignment: Alignment.center,
                    child: const Text(
                      'NO ACTIVE SLOTS FOR TODAY',
                      style: TextStyle(fontFamily: 'monospace', fontSize: 11, color: Colors.grey),
                    ),
                  )
                else
                  ...todaySlots.map((slot) {
                    final sub = subjects.firstWhere(
                      (s) => s.id == slot.subjectId,
                      orElse: () => Subject(id: 'err', name: 'Unknown', code: '---'),
                    );
                    final action = dailyActions[slot.id];
                    final isDeficit = !sub.isSafe(criteriaCutoff);

                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isDark ? SwissColors.surface0Dark : SwissColors.surface0Light,
                        border: Border.all(
                          color: isDark ? SwissColors.borderDark : SwissColors.borderLight,
                        ),
                        borderRadius: BorderRadius.circular(3),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              Text(
                                '${slot.startTime} — ${slot.endTime}',
                                style: const TextStyle(
                                  fontFamily: 'monospace',
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.grey,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                                decoration: BoxDecoration(
                                  color: isDeficit
                                      ? SwissColors.accentRed.withOpacity(0.15)
                                      : SwissColors.accentGreen.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(2),
                                ),
                                child: Text(
                                  '${sub.percentage.toStringAsFixed(1)}%',
                                  style: TextStyle(
                                    fontFamily: 'monospace',
                                    fontSize: 10,
                                    fontWeight: FontWeight.w800,
                                    color: isDeficit ? SwissColors.accentRed : SwissColors.accentGreen,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${sub.code}: ${sub.name}',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                              color: isDark ? Colors.white : SwissColors.obsidian,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'FACILITY: ${slot.room.isNotEmpty ? slot.room : "N/A"} • INSTRUCTOR: ${sub.teacher}',
                            style: const TextStyle(
                              fontFamily: 'monospace',
                              fontSize: 10,
                              color: Colors.grey,
                            ),
                          ),
                          const SizedBox(height: 10),

                          // Action Buttons (Pure vector text & symbols)
                          Row(
                            children: [
                              Expanded(
                                child: _SwissButton(
                                  label: action == 'yes' ? 'LOGGED' : 'ATTENDED',
                                  isSelected: action == 'yes',
                                  activeColor: SwissColors.accentGreen,
                                  onTap: () => onMarkAttendance(sub.id, slot.id, 'yes'),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: _SwissButton(
                                  label: action == 'no' ? 'ABSENT' : 'ABSENT',
                                  isSelected: action == 'no',
                                  activeColor: SwissColors.accentRed,
                                  onTap: () => onMarkAttendance(sub.id, slot.id, 'no'),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: _SwissButton(
                                  label: action == 'cancel' ? 'EXEMPT' : 'EXEMPT',
                                  isSelected: action == 'cancel',
                                  activeColor: isDark ? Colors.white : SwissColors.obsidian,
                                  onTap: () => onMarkAttendance(sub.id, slot.id, 'cancel'),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  }),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SwissButton extends StatelessWidget {
  final String label;
  final bool isSelected;
  final Color activeColor;
  final VoidCallback onTap;

  const _SwissButton({
    required this.label,
    required this.isSelected,
    required this.activeColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 7),
        decoration: BoxDecoration(
          color: isSelected
              ? activeColor
              : (isDark ? SwissColors.surface1Dark : SwissColors.surface1Light),
          border: Border.all(
            color: isSelected ? activeColor : (isDark ? SwissColors.borderDark : SwissColors.borderLight),
          ),
          borderRadius: BorderRadius.circular(3),
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style: TextStyle(
            fontFamily: 'monospace',
            fontSize: 10,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.5,
            color: isSelected ? Colors.white : (isDark ? Colors.grey[400] : Colors.grey[800]),
          ),
        ),
      ),
    );
  }
}
