// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'screening_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Screening _$ScreeningFromJson(Map<String, dynamic> json) => Screening(
      id: json['id'] as String,
      applicationId: json['application_id'] as String,
      tenantId: json['tenant_id'] as String,
      landlordId: json['landlord_id'] as String,
      status: json['status'] as String,
      reportUrl: json['report_url'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );

Map<String, dynamic> _$ScreeningToJson(Screening instance) => <String, dynamic>{
      'id': instance.id,
      'application_id': instance.applicationId,
      'tenant_id': instance.tenantId,
      'landlord_id': instance.landlordId,
      'status': instance.status,
      'report_url': instance.reportUrl,
      'created_at': instance.createdAt.toIso8601String(),
    };
