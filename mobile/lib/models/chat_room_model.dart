import 'package:json_annotation/json_annotation.dart';

part 'chat_room_model.g.dart';

@JsonSerializable()
class ChatRoom {
  final String id;
  @JsonKey(name: 'tenant_id')
  final String tenantId;
  @JsonKey(name: 'landlord_id')
  final String landlordId;
  @JsonKey(name: 'property_id')
  final String propertyId;
  @JsonKey(name: 'is_active')
  final bool isActive;
  @JsonKey(name: 'last_message_at')
  final DateTime? lastMessageAt;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  ChatRoom({
    required this.id,
    required this.tenantId,
    required this.landlordId,
    required this.propertyId,
    required this.isActive,
    this.lastMessageAt,
    required this.createdAt,
  });

  factory ChatRoom.fromJson(Map<String, dynamic> json) =>
      _$ChatRoomFromJson(json);
  Map<String, dynamic> toJson() => _$ChatRoomToJson(this);
}
