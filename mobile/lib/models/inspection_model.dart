import 'package:json_annotation/json_annotation.dart';

part 'inspection_model.g.dart';

@JsonSerializable()
class Inspection {
  final String id;
  @JsonKey(name: 'property_id')
  final String propertyId;
  @JsonKey(name: 'landlord_id')
  final String landlordId;
  final DateTime date;
  final String notes;
  final String status; // 'scheduled' | 'completed' | 'cancelled'
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  Inspection({
    required this.id,
    required this.propertyId,
    required this.landlordId,
    required this.date,
    required this.notes,
    required this.status,
    required this.createdAt,
  });

  factory Inspection.fromJson(Map<String, dynamic> json) =>
      _$InspectionFromJson(json);
  Map<String, dynamic> toJson() => _$InspectionToJson(this);
}
