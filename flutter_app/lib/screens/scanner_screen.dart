import 'package:flutter/material.dart';
import '../theme/swiss_theme.dart';

class ScannerScreen extends StatefulWidget {
  final Function(String preset) onLoadPreset;

  const ScannerScreen({super.key, required this.onLoadPreset});

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  String _status = '> OPTICAL ENGINE STANDBY: ATTACH TIMETABLE IMAGE MATRIX.';

  void _simulateScan() {
    setState(() {
      _status = '> ANALYZING IMAGE MATRIX...\n> DETECTING TIMING COLUMNS & COURSE IDENTIFIERS...';
    });

    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) {
        setState(() {
          _status = '> PARSING COMPLETE: TIMETABLE MATRIX RECOGNIZED.\n> 1 NEW COURSE & 1 SLOT MAPPED.';
        });
        widget.onLoadPreset('ocr_demo');
      }
    });
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
            'OPTICAL TIMETABLE SCANNER',
            style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 0.8),
          ),
          const SizedBox(height: 6),
          const Text(
            'Upload or capture an image of your printed college timetable. The parsing engine extracts course codes and updates your weekly matrix automatically.',
            style: TextStyle(fontSize: 11, color: Colors.grey),
          ),
          const SizedBox(height: 14),

          // Upload Dropzone
          GestureDetector(
            onTap: _simulateScan,
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 16),
              decoration: BoxDecoration(
                color: isDark ? SwissColors.surface0Dark : SwissColors.surface0Light,
                borderRadius: BorderRadius.circular(3),
                border: Border.all(
                  color: isDark ? SwissColors.borderDark : SwissColors.borderLight,
                  style: BorderStyle.solid,
                ),
              ),
              alignment: Alignment.center,
              child: Column(
                children: [
                  Icon(Icons.camera_alt_outlined, size: 32, color: Colors.grey[500]),
                  const SizedBox(height: 8),
                  const Text(
                    'SELECT OR CAPTURE TIMETABLE IMAGE',
                    style: TextStyle(fontFamily: 'monospace', fontSize: 11, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 2),
                  const Text('JPG, PNG, WEBP FORMATS', style: TextStyle(fontFamily: 'monospace', fontSize: 9, color: Colors.grey)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Presets Section
          const Text('STANDARDIZED COLLEGE CURRICULUM PRESETS:', style: TextStyle(fontFamily: 'monospace', fontSize: 10, fontWeight: FontWeight.w800, color: Colors.grey)),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(3))),
                  onPressed: () => widget.onLoadPreset('cse'),
                  child: const Text('CS & ENG', style: TextStyle(fontFamily: 'monospace', fontSize: 10, fontWeight: FontWeight.w800)),
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(3))),
                  onPressed: () => widget.onLoadPreset('ece'),
                  child: const Text('ELECTRONICS', style: TextStyle(fontFamily: 'monospace', fontSize: 10, fontWeight: FontWeight.w800)),
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(3))),
                  onPressed: () => widget.onLoadPreset('bba'),
                  child: const Text('MANAGEMENT', style: TextStyle(fontFamily: 'monospace', fontSize: 10, fontWeight: FontWeight.w800)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Status Console
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isDark ? SwissColors.surface1Dark : SwissColors.surface1Light,
              borderRadius: BorderRadius.circular(3),
              border: Border.all(color: isDark ? SwissColors.borderDark : SwissColors.borderLight),
            ),
            child: Text(
              _status,
              style: const TextStyle(fontFamily: 'monospace', fontSize: 11, color: Colors.grey, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }
}
