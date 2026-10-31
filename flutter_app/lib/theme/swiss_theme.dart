import 'package:flutter/material.dart';

class SwissColors {
  // Swiss Modernist Monochrome Palette
  static const Color obsidian = Color(0xFF09090B);
  static const Color surface0Dark = Color(0xFF121215);
  static const Color surface1Dark = Color(0xFF18181C);
  static const Color borderDark = Color(0xFF27272A);

  static const Color canvasLight = Color(0xFFF4F4F6);
  static const Color surface0Light = Color(0xFFFFFFFF);
  static const Color surface1Light = Color(0xFFFAFAFB);
  static const Color borderLight = Color(0xFFE4E4E7);

  // Accents
  static const Color accentRed = Color(0xFFE11D48);
  static const Color accentGreen = Color(0xFF059669);
  static const Color accentAmber = Color(0xFFD97706);
}

class SwissTheme {
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: SwissColors.canvasLight,
    colorScheme: const ColorScheme.light(
      primary: SwissColors.obsidian,
      secondary: SwissColors.accentGreen,
      error: SwissColors.accentRed,
      surface: SwissColors.surface0Light,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: SwissColors.surface0Light,
      elevation: 0,
      scrolledUnderElevation: 1,
      iconTheme: IconThemeData(color: SwissColors.obsidian),
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: SwissColors.obsidian,
    colorScheme: const ColorScheme.dark(
      primary: Colors.white,
      secondary: SwissColors.accentGreen,
      error: SwissColors.accentRed,
      surface: SwissColors.surface0Dark,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: SwissColors.surface0Dark,
      elevation: 0,
      scrolledUnderElevation: 1,
      iconTheme: IconThemeData(color: Colors.white),
    ),
  );
}
