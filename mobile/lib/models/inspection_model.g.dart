// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'inspection_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Inspection _$InspectionFromJson(Map<String, dynamic> json) => Inspection(
      id: json['id'] as String,
      propertyId: json['property_id'] as String,
      landlordId: json['landlord_id'] as String,
      date: DateTime.parse(json['date'] as String),
      notes: json['notes'] as String,
      status: json['status'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );

Map<String, dynamic> _$InspectionToJson(Inspection instance) =>
    <String, dynamic>{
      'id': instance.id,
      'property_id': instance.propertyId,
      'landlord_id': instance.landlordId,
      'date': instance.date.toIso8601String(),
      'notes': instance.notes,
      'status': instance.status,
      'created_at': instance.createdAt.toIso8601String(),
    };
