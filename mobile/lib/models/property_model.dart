import 'package:json_annotation/json_annotation.dart';

part 'property_model.g.dart';

@JsonSerializable()
class Property {
  final String id;
  @JsonKey(name: 'landlord_id')
  final String landlordId;
  final String name;
  final String description;
  final String address;
  final String city;
  final String state;
  final String area;
  final double latitude;
  final double longitude;
  @JsonKey(name: 'rent_amount')
  final double rentAmount;
  final int bedrooms;
  final int bathrooms;
  @JsonKey(name: 'category_id')
  final String categoryId;
  final List<String> gallery;
  @JsonKey(name: 'is_available')
  final bool isAvailable;
  @JsonKey(name: 'is_verified')
  final bool isVerified;
  @JsonKey(name: 'is_featured')
  final bool isFeatured;
  @JsonKey(name: 'featured_until')
  final DateTime? featuredUntil;
  final bool deleted;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  // Additional fields for UI
  final double? rating;
  final int? reviewCount;

  Property({
    required this.id,
    required this.landlordId,
    required this.name,
    required this.description,
    required this.address,
    required this.city,
    required this.state,
    required this.area,
    required this.latitude,
    required this.longitude,
    required this.rentAmount,
    required this.bedrooms,
    required this.bathrooms,
    required this.categoryId,
    required this.gallery,
    required this.isAvailable,
    required this.isVerified,
    required this.isFeatured,
    this.featuredUntil,
    this.deleted = false,
    required this.createdAt,
    required this.updatedAt,
    this.rating,
    this.reviewCount,
  });

  factory Property.fromJson(Map<String, dynamic> json) =>
      _$PropertyFromJson(json);
  Map<String, dynamic> toJson() => _$PropertyToJson(this);

  String get fullAddress => '$address, $city, $state';
}
