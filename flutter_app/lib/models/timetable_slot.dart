class TimetableSlot {
  final String id;
  int day; // 1 = Mon, 2 = Tue ... 6 = Sat
  String subjectId;
  String startTime; // "09:00"
  String endTime;   // "10:00"
  String room;

  TimetableSlot({
    required this.id,
    required this.day,
    required this.subjectId,
    required this.startTime,
    required this.endTime,
    this.room = '',
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'day': day,
    'subjectId': subjectId,
    'startTime': startTime,
    'endTime': endTime,
    'room': room,
  };

  factory TimetableSlot.fromJson(Map<String, dynamic> json) => TimetableSlot(
    id: json['id'],
    day: json['day'],
    subjectId: json['subjectId'],
    startTime: json['startTime'],
    endTime: json['endTime'],
    room: json['room'] ?? '',
  );
}

class Holiday {
  final String id;
  final String date; // YYYY-MM-DD
  final String title;

  Holiday({required this.id, required this.date, required this.title});

  Map<String, dynamic> toJson() => {'id': id, 'date': date, 'title': title};
  factory Holiday.fromJson(Map<String, dynamic> json) => Holiday(
    id: json['id'],
    date: json['date'],
    title: json['title'],
  );
}
