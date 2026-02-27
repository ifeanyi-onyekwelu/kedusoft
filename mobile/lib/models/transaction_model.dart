import 'package:json_annotation/json_annotation.dart';

part 'transaction_model.g.dart';

@JsonSerializable()
class Transaction {
  final String id;
  @JsonKey(name: 'user_id')
  final String userId;
  @JsonKey(name: 'property_id')
  final String? propertyId;
  final double amount;
  final String purpose; // 'rent' | 'utility' | 'screening_fee' | 'other'
  final String status; // 'pending' | 'completed' | 'failed'
  final String reference;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  Transaction({
    required this.id,
    required this.userId,
    this.propertyId,
    required this.amount,
    required this.purpose,
    required this.status,
    required this.reference,
    required this.createdAt,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) =>
      _$TransactionFromJson(json);
  Map<String, dynamic> toJson() => _$TransactionToJson(this);
}
