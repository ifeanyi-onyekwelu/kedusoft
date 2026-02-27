import 'package:json_annotation/json_annotation.dart';

part 'screening_model.g.dart';

@JsonSerializable()
class Screening {
  final String id;
  @JsonKey(name: 'application_id')
  final String applicationId;
  @JsonKey(name: 'tenant_id')
  final String tenantId;
  @JsonKey(name: 'landlord_id')
  final String landlordId;
  final String status; // 'pending' | 'completed' | 'accepted' | 'declined'
  @JsonKey(name: 'report_url')
  final String? reportUrl;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  Screening({
    required this.id,
    required this.applicationId,
    required this.tenantId,
    required this.landlordId,
    required this.status,
    this.reportUrl,
    required this.createdAt,
  });

  factory Screening.fromJson(Map<String, dynamic> json) =>
      _$ScreeningFromJson(json);
  Map<String, dynamic> toJson() => _$ScreeningToJson(this);
}
