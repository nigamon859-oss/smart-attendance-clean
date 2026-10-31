import 'package:flutter/material.dart';
import '../theme/swiss_theme.dart';

class TelemetryCard extends StatelessWidget {
  final double overallPercentage;
  final int totalAttended;
  final int totalConducted;
  final int safeBunks;
  final int recoveryRequired;
  final bool isSafe;
  final double cutoff;

  const TelemetryCard({
    super.key,
    required this.overallPercentage,
    required this.totalAttended,
    required this.totalConducted,
    required this.safeBunks,
    required this.recoveryRequired,
    required this.isSafe,
    required this.cutoff,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.all(16),
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
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              _Tag(label: 'TELEMETRY // AGGREGATE', isDark: isDark),
              _Tag(label: 'CUTOFF: ${cutoff.toStringAsFixed(1)}%', isDark: isDark),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                '${overallPercentage.toStringAsFixed(1)}%',
                style: TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 44,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -1.5,
                  color: isDark ? Colors.white : SwissColors.obsidian,
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  children: [
                    _StatRow(label: 'CONDUCTED:', value: '$totalConducted UNITS', isDark: isDark),
                    _StatRow(label: 'ATTENDED:', value: '$totalAttended UNITS', isDark: isDark),
                    _StatRow(label: 'ABSENT:', value: '${totalConducted - totalAttended} UNITS', isDark: isDark),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Linear Precision Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(3),
            child: LinearProgressIndicator(
              value: (overallPercentage / 100).clamp(0.0, 1.0),
              minHeight: 8,
              backgroundColor: isDark ? SwissColors.surface1Dark : SwissColors.canvasLight,
              valueColor: AlwaysStoppedAnimation<Color>(
                isSafe ? SwissColors.accentGreen : SwissColors.accentRed,
              ),
            ),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text('0%', style: TextStyle(fontFamily: 'monospace', fontSize: 9, color: Colors.grey[500])),
              Text('50%', style: TextStyle(fontFamily: 'monospace', fontSize: 9, color: Colors.grey[500])),
              Text(
                '${cutoff.toInt()}% [CUTOFF]',
                style: const TextStyle(fontFamily: 'monospace', fontSize: 9, color: SwissColors.accentRed, fontWeight: FontWeight.w800),
              ),
              Text('100%', style: TextStyle(fontFamily: 'monospace', fontSize: 9, color: Colors.grey[500])),
            ],
          ),
          const SizedBox(height: 12),

          // Status Pill (Zero emojis)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: isSafe ? SwissColors.accentGreen.withOpacity(0.12) : SwissColors.accentRed.withOpacity(0.12),
              borderRadius: BorderRadius.circular(3),
              border: Border.all(
                color: isSafe ? SwissColors.accentGreen : SwissColors.accentRed,
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  isSafe ? Icons.check : Icons.warning_amber_rounded,
                  size: 14,
                  color: isSafe ? SwissColors.accentGreen : SwissColors.accentRed,
                ),
                const SizedBox(width: 6),
                Text(
                  isSafe
                      ? 'STATUS: COMPLIANT • $safeBunks SAFE BUNK UNITS AVAILABLE'
                      : 'STATUS: DEFICIT • ATTEND NEXT $recoveryRequired CONSECUTIVE UNITS',
                  style: TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: isSafe ? SwissColors.accentGreen : SwissColors.accentRed,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Tag extends StatelessWidget {
  final String label;
  final bool isDark;
  const _Tag({required this.label, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: isDark ? SwissColors.surface1Dark : SwissColors.surface1Light,
        borderRadius: BorderRadius.circular(3),
        border: Border.all(color: isDark ? SwissColors.borderDark : SwissColors.borderLight),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontFamily: 'monospace',
          fontSize: 9,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.5,
          color: isDark ? Colors.grey[400] : Colors.grey[600],
        ),
      ),
    );
  }
}

class _StatRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isDark;
  const _StatRow({required this.label, required this.value, required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.between,
      children: [
        Text(
          label,
          style: TextStyle(
            fontFamily: 'monospace',
            fontSize: 10,
            color: isDark ? Colors.grey[400] : Colors.grey[600],
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontFamily: 'monospace',
            fontSize: 10,
            fontWeight: FontWeight.w800,
            color: isDark ? Colors.white : Colors.black87,
          ),
        ),
      ],
    );
  }
}
