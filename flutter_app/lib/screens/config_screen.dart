import 'package:flutter/material.dart';
import '../theme/swiss_theme.dart';

class ConfigScreen extends StatefulWidget {
  final double criteriaCutoff;
  final Function(double) onUpdateCutoff;
  final VoidCallback onPurgeState;

  const ConfigScreen({
    super.key,
    required this.criteriaCutoff,
    required this.onUpdateCutoff,
    required this.onPurgeState,
  });

  @override
  State<ConfigScreen> createState() => _ConfigScreenState();
}

class _ConfigScreenState extends State<ConfigScreen> {
  late double _cutoff;

  @override
  void initState() {
    super.initState();
    _cutoff = widget.criteriaCutoff;
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
          const Text(
            'PARAMETERS & TELEMETRY CONFIG',
            style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 0.8),
          ),
          const SizedBox(height: 14),

          // Cutoff Threshold
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isDark ? SwissColors.surface0Dark : SwissColors.surface0Light,
              borderRadius: BorderRadius.circular(3),
              border: Border.all(color: isDark ? SwissColors.borderDark : SwissColors.borderLight),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text('MINIMUM CRITERIA CUTOFF', style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w800)),
                    Text('${_cutoff.toStringAsFixed(1)}%', style: const TextStyle(fontFamily: 'monospace', fontSize: 12, fontWeight: FontWeight.w900, color: SwissColors.accentRed)),
                  ],
                ),
                Slider(
                  value: _cutoff,
                  min: 50.0,
                  max: 95.0,
                  divisions: 45,
                  activeColor: isDark ? Colors.white : SwissColors.obsidian,
                  onChanged: (val) {
                    setState(() => _cutoff = val);
                    widget.onUpdateCutoff(val);
                  },
                ),
                const Text('Deficit warnings trigger when attendance falls below this ratio.', style: TextStyle(fontSize: 10, color: Colors.grey)),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Notification Harness
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isDark ? SwissColors.surface0Dark : SwissColors.surface0Light,
              borderRadius: BorderRadius.circular(3),
              border: Border.all(color: isDark ? SwissColors.borderDark : SwissColors.borderLight),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('NOTIFICATION HARNESS DIAGNOSTICS', style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w800)),
                const SizedBox(height: 6),
                const Text('Pre-class (10m) & post-class update notifications.', style: TextStyle(fontSize: 10, color: Colors.grey)),
                const SizedBox(height: 10),
                OutlinedButton(
                  style: OutlinedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(3))),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('AUDIO HARNESS OPERATIONAL. TACTILE HARNESS ACTIVE.')),
                    );
                  },
                  child: const Text('TEST AUDIO CHIME', style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w800)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Purge State
          OutlinedButton(
            style: OutlinedButton.styleFrom(
              foregroundColor: SwissColors.accentRed,
              side: const BorderSide(color: SwissColors.accentRed),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(3)),
            ),
            onPressed: widget.onPurgeState,
            child: const Text('PURGE STATE // FACTORY RESET', style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w800)),
          ),
        ],
      ),
    );
  }
}
