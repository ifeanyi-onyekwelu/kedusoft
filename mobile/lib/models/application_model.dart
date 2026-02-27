import 'package:json_annotation/json_annotation.dart';

part 'application_model.g.dart';

@JsonSerializable()
class Application {
  final String id;
  @JsonKey(name: 'tenant_id')
  final String tenantId;
  @JsonKey(name: 'property_id')
  final String propertyId;
  @JsonKey(name: 'property_title')
  final String? propertyTitle;
  @JsonKey(name: 'property_image')
  final String? propertyImage;
  @JsonKey(name: 'landlord_id')
  final String landlordId;
  final String status; // 'pending' | 'approved' | 'rejected' | 'withdrawn'
  final List<String>? documents;
  @JsonKey(name: 'submitted_at')
  final DateTime submittedAt;
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  Application({
    required this.id,
    required this.tenantId,
    required this.propertyId,
    this.propertyTitle,
    this.propertyImage,
    required this.landlordId,
    required this.status,
    this.documents,
    required this.submittedAt,
    required this.updatedAt,
  });

  factory Application.fromJson(Map<String, dynamic> json) =>
      _$ApplicationFromJson(json);
  Map<String, dynamic> toJson() => _$ApplicationToJson(this);
}
