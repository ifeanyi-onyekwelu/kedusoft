import 'package:json_annotation/json_annotation.dart';

part 'maintenance_request_model.g.dart';

@JsonSerializable()
class MaintenanceRequest {
  final String id;
  @JsonKey(name: 'property_id')
  final String propertyId;
  @JsonKey(name: 'landlord_id')
  final String landlordId;
  final String description;
  final String status; // 'pending' | 'in_progress' | 'completed'
  final String priority; // 'low' | 'medium' | 'high'
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  MaintenanceRequest({
    required this.id,
    required this.propertyId,
    required this.landlordId,
    required this.description,
    required this.status,
    required this.priority,
    required this.createdAt,
  });

  factory MaintenanceRequest.fromJson(Map<String, dynamic> json) =>
      _$MaintenanceRequestFromJson(json);
  Map<String, dynamic> toJson() => _$MaintenanceRequestToJson(this);
}
