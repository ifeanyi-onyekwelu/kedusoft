import 'package:json_annotation/json_annotation.dart';

part 'lease_model.g.dart';

@JsonSerializable()
class Lease {
  final String id;
  @JsonKey(name: 'property_id')
  final String propertyId;
  @JsonKey(name: 'tenant_id')
  final String tenantId;
  @JsonKey(name: 'landlord_id')
  final String landlordId;
  @JsonKey(name: 'start_date')
  final DateTime startDate;
  @JsonKey(name: 'end_date')
  final DateTime endDate;
  @JsonKey(name: 'rent_amount')
  final double rentAmount;
  final String status; // 'draft' | 'pending' | 'active' | 'completed'
  @JsonKey(name: 'tenant_signed_at')
  final DateTime? tenantSignedAt;
  @JsonKey(name: 'landlord_signed_at')
  final DateTime? landlordSignedAt;
  @JsonKey(name: 'tenant_signature')
  final String? tenantSignature;
  @JsonKey(name: 'landlord_signature')
  final String? landlordSignature;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  Lease({
    required this.id,
    required this.propertyId,
    required this.tenantId,
    required this.landlordId,
    required this.startDate,
    required this.endDate,
    required this.rentAmount,
    required this.status,
    this.tenantSignedAt,
    this.landlordSignedAt,
    this.tenantSignature,
    this.landlordSignature,
    required this.createdAt,
  });

  factory Lease.fromJson(Map<String, dynamic> json) => _$LeaseFromJson(json);
  Map<String, dynamic> toJson() => _$LeaseToJson(this);

  bool get isTenantSigned => tenantSignedAt != null;
  bool get isLandlordSigned => landlordSignedAt != null;
  bool get fullySigned => isTenantSigned && isLandlordSigned;
}
