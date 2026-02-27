// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'transaction_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Transaction _$TransactionFromJson(Map<String, dynamic> json) => Transaction(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      propertyId: json['property_id'] as String?,
      amount: (json['amount'] as num).toDouble(),
      purpose: json['purpose'] as String,
      status: json['status'] as String,
      reference: json['reference'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );

Map<String, dynamic> _$TransactionToJson(Transaction instance) =>
    <String, dynamic>{
      'id': instance.id,
      'user_id': instance.userId,
      'property_id': instance.propertyId,
      'amount': instance.amount,
      'purpose': instance.purpose,
      'status': instance.status,
      'reference': instance.reference,
      'created_at': instance.createdAt.toIso8601String(),
    };
