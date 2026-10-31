import 'package:flutter/material.dart';
import '../models/timetable_slot.dart';
import '../theme/swiss_theme.dart';

class HolidaysScreen extends StatelessWidget {
  final List<Holiday> holidays;
  final Function(Holiday) onAddHoliday;
  final Function(String id) onDeleteHoliday;

  const HolidaysScreen({
    super.key,
    required this.holidays,
    required this.onAddHoliday,
    required this.onDeleteHoliday,
  });

  void _showAddHolidayDialog(BuildContext context) {
    String date = DateTime.now().toString().substring(0, 10);
    String title = '';

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Theme.of(context).brightness == Brightness.dark
            ? SwissColors.surface0Dark
            : SwissColors.surface0Light,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
        title: const Text(
          'RECESS / OFF-DAY DEFINITION',
          style: TextStyle(fontFamily: 'monospace', fontSize: 12, fontWeight: FontWeight.w900),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              initialValue: date,
              decoration: const InputDecoration(labelText: 'DATE (YYYY-MM-DD)', isDense: true),
              onChanged: (val) => date = val,
            ),
            const SizedBox(height: 10),
            TextFormField(
              decoration: const InputDecoration(labelText: 'DESIGNATION / OCCASION', isDense: true),
              onChanged: (val) => title = val,
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
              if (title.trim().isNotEmpty) {
                onAddHoliday(Holiday(
                  id: 'h_${DateTime.now().millisecondsSinceEpoch}',
                  date: date.trim(),
                  title: title.trim(),
                ));
              }
              Navigator.pop(ctx);
            },
            child: const Text('REGISTER LEAVE', style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w800)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(14),
      physics: const BouncingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text(
                'CALENDAR // OFF-DAYS & RECESS',
                style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 0.8),
              ),
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  minimumSize: const Size(60, 30),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(3)),
                ),
                onPressed: () => _showAddHolidayDialog(context),
                child: const Text('+ ADD LEAVE', style: TextStyle(fontFamily: 'monospace', fontSize: 10, fontWeight: FontWeight.w800)),
              ),
            ],
          ),
          const SizedBox(height: 6),
          const Text(
            'Scheduled lectures falling on these dates are exempt from calculations and will not penalize percentages.',
            style: TextStyle(fontSize: 11, color: Colors.grey),
          ),
          const SizedBox(height: 14),

          if (holidays.isEmpty)
            Container(
              padding: const EdgeInsets.all(24),
              alignment: Alignment.center,
              child: const Text(
                'NO OFF-DAYS REGISTERED.',
                style: TextStyle(fontFamily: 'monospace', fontSize: 11, color: Colors.grey),
              ),
            )
          else
            ...holidays.map((h) => Container(
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
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(h.date, style: const TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w800)),
                          const SizedBox(height: 2),
                          Text(h.title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete_outline, size: 18, color: SwissColors.accentRed),
                        onPressed: () => onDeleteHoliday(h.id),
                      ),
                    ],
                  ),
                )),
        ],
      ),
    );
  }
}
