// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'property_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Property _$PropertyFromJson(Map<String, dynamic> json) => Property(
      id: json['id'] as String,
      landlordId: json['landlord_id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      address: json['address'] as String,
      city: json['city'] as String,
      state: json['state'] as String,
      area: json['area'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      rentAmount: (json['rent_amount'] as num).toDouble(),
      bedrooms: (json['bedrooms'] as num).toInt(),
      bathrooms: (json['bathrooms'] as num).toInt(),
      categoryId: json['category_id'] as String,
      gallery:
          (json['gallery'] as List<dynamic>).map((e) => e as String).toList(),
      isAvailable: json['is_available'] as bool,
      isVerified: json['is_verified'] as bool,
      isFeatured: json['is_featured'] as bool,
      featuredUntil: json['featured_until'] == null
          ? null
          : DateTime.parse(json['featured_until'] as String),
      deleted: json['deleted'] as bool? ?? false,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      rating: (json['rating'] as num?)?.toDouble(),
      reviewCount: (json['reviewCount'] as num?)?.toInt(),
    );

Map<String, dynamic> _$PropertyToJson(Property instance) => <String, dynamic>{
      'id': instance.id,
      'landlord_id': instance.landlordId,
      'name': instance.name,
      'description': instance.description,
      'address': instance.address,
      'city': instance.city,
      'state': instance.state,
      'area': instance.area,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'rent_amount': instance.rentAmount,
      'bedrooms': instance.bedrooms,
      'bathrooms': instance.bathrooms,
      'category_id': instance.categoryId,
      'gallery': instance.gallery,
      'is_available': instance.isAvailable,
      'is_verified': instance.isVerified,
      'is_featured': instance.isFeatured,
      'featured_until': instance.featuredUntil?.toIso8601String(),
      'deleted': instance.deleted,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
      'rating': instance.rating,
      'reviewCount': instance.reviewCount,
    };
