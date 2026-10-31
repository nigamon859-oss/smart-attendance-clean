class Subject {
  final String id;
  String name;
  String code;
  String teacher;
  int attended;
  int missed;
  int cancelled;

  Subject({
    required this.id,
    required this.name,
    this.code = '',
    this.teacher = '',
    this.attended = 0,
    this.missed = 0,
    this.cancelled = 0,
  });

  int get totalConducted => attended + missed;

  double get percentage {
    if (totalConducted == 0) return 100.0;
    return (attended / totalConducted) * 100;
  }

  bool isSafe(double cutoff) => percentage >= cutoff;

  int safeBunks(double cutoff) {
    if (percentage < cutoff) return 0;
    final val = ((attended * 100) - (cutoff * totalConducted)) / cutoff;
    return val.floor() > 0 ? val.floor() : 0;
  }

  int recoveryRequired(double cutoff) {
    if (percentage >= cutoff) return 0;
    final denom = (100 - cutoff) <= 0 ? 1.0 : (100 - cutoff);
    final val = ((cutoff * totalConducted) - (100 * attended)) / denom;
    return val.ceil() > 0 ? val.ceil() : 0;
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'code': code,
    'teacher': teacher,
    'attended': attended,
    'missed': missed,
    'cancelled': cancelled,
  };

  factory Subject.fromJson(Map<String, dynamic> json) => Subject(
    id: json['id'],
    name: json['name'],
    code: json['code'] ?? '',
    teacher: json['teacher'] ?? '',
    attended: json['attended'] ?? 0,
    missed: json['missed'] ?? 0,
    cancelled: json['cancelled'] ?? 0,
  );
}
