// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lease_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Lease _$LeaseFromJson(Map<String, dynamic> json) => Lease(
      id: json['id'] as String,
      propertyId: json['property_id'] as String,
      tenantId: json['tenant_id'] as String,
      landlordId: json['landlord_id'] as String,
      startDate: DateTime.parse(json['start_date'] as String),
      endDate: DateTime.parse(json['end_date'] as String),
      rentAmount: (json['rent_amount'] as num).toDouble(),
      status: json['status'] as String,
      tenantSignedAt: json['tenant_signed_at'] == null
          ? null
          : DateTime.parse(json['tenant_signed_at'] as String),
      landlordSignedAt: json['landlord_signed_at'] == null
          ? null
          : DateTime.parse(json['landlord_signed_at'] as String),
      tenantSignature: json['tenant_signature'] as String?,
      landlordSignature: json['landlord_signature'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );

Map<String, dynamic> _$LeaseToJson(Lease instance) => <String, dynamic>{
      'id': instance.id,
      'property_id': instance.propertyId,
      'tenant_id': instance.tenantId,
      'landlord_id': instance.landlordId,
      'start_date': instance.startDate.toIso8601String(),
      'end_date': instance.endDate.toIso8601String(),
      'rent_amount': instance.rentAmount,
      'status': instance.status,
      'tenant_signed_at': instance.tenantSignedAt?.toIso8601String(),
      'landlord_signed_at': instance.landlordSignedAt?.toIso8601String(),
      'tenant_signature': instance.tenantSignature,
      'landlord_signature': instance.landlordSignature,
      'created_at': instance.createdAt.toIso8601String(),
    };
