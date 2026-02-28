import 'package:json_annotation/json_annotation.dart';
import 'dart:io';

class CustomDateTimeConverter implements JsonConverter<DateTime?, dynamic> {
  const CustomDateTimeConverter();

  @override
  DateTime? fromJson(dynamic json) {
    if (json == null) return null;
    if (json is DateTime) return json;

    if (json is! String) {
      print(
        'CustomDateTimeConverter: Input is not a string: ${json.runtimeType}',
      );
      return null;
    }

    // Try ISO 8601 format first (e.g., "2025-12-27T06:10:50Z" or "2025-12-27")
    try {
      return DateTime.parse(json);
    } catch (e) {
      print('CustomDateTimeConverter: ISO 8601 parsing failed for "$json": $e');
    }

    // Try RFC 1123 format (e.g., "Sat, 27 Dec 2025 06:10:50 GMT")
    try {
      return HttpDate.parse(json);
    } catch (e) {
      print('CustomDateTimeConverter: RFC 1123 parsing failed for "$json": $e');
    }

    // Try removing GMT suffix and parsing as RFC 1123
    try {
      final cleanJson = json.replaceAll(' GMT', '');
      return HttpDate.parse(cleanJson);
    } catch (e) {
      print(
        'CustomDateTimeConverter: RFC 1123 (no GMT) parsing failed for "$json": $e',
      );
    }

    // If all else fails, log and return null
    print('CustomDateTimeConverter: Could not parse date "$json"');
    return null;
  }

  @override
  dynamic toJson(DateTime? object) {
    if (object == null) return null;
    return object.toIso8601String();
  }
}
