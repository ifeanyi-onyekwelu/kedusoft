// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'application_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Application _$ApplicationFromJson(Map<String, dynamic> json) => Application(
      id: json['id'] as String,
      tenantId: json['tenant_id'] as String,
      propertyId: json['property_id'] as String,
      landlordId: json['landlord_id'] as String,
      status: json['status'] as String,
      documents: (json['documents'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      submittedAt: DateTime.parse(json['submitted_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );

Map<String, dynamic> _$ApplicationToJson(Application instance) =>
    <String, dynamic>{
      'id': instance.id,
      'tenant_id': instance.tenantId,
      'property_id': instance.propertyId,
      'landlord_id': instance.landlordId,
      'status': instance.status,
      'documents': instance.documents,
      'submitted_at': instance.submittedAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };
