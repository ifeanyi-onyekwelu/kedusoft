import 'package:json_annotation/json_annotation.dart';
import 'package:letsten/utils/date_converter.dart';

part 'property_model.g.dart';

@JsonSerializable()
class Property {
  final String id;
  final String? description;
  final String address;
  final String area;
  final String city;
  final String? state;
  final double? latitude;
  final double? longitude;
  @JsonKey(name: 'agreement_fee')
  final double? agreementFee;
  @JsonKey(name: 'caution_fee')
  final double? cautionFee;
  @JsonKey(name: 'rent_amount')
  final double? rentAmount;
  final int? bedrooms;
  final int? bathrooms;
  @JsonKey(name: 'category_id')
  final String? categoryId;
  final List<String>? gallery;
  @JsonKey(name: 'cover_image')
  final String? coverImage;
  @JsonKey(name: 'is_available')
  final bool? isAvailable;
  @JsonKey(name: 'is_verified')
  final bool? isVerified;
  @JsonKey(name: 'is_featured')
  final bool? isFeatured;
  @CustomDateTimeConverter()
  @JsonKey(name: 'featured_until')
  final DateTime? featuredUntil;
  @JsonKey(name: 'featured_priority')
  final int? featuredPriority;
  final bool? deleted;
  @CustomDateTimeConverter()
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;
  @CustomDateTimeConverter()
  @JsonKey(name: 'updated_at')
  final DateTime? updatedAt;
  @JsonKey(name: 'closest_landmark')
  final String? closestLandmark;
  final String? furnished;
  @JsonKey(name: 'furnishing_details')
  final String? furnishingDetails;
  final bool? flagged;
  @JsonKey(name: 'floors_no')
  final int? floorsNo;
  @JsonKey(name: 'has_parking')
  final bool? hasParking;
  @JsonKey(name: 'has_water_heater')
  final bool? hasWaterHeater;
  @JsonKey(name: 'accessibility_features')
  final String? accessibilityFeatures;
  final Map<String, dynamic>? amenities;
  @CustomDateTimeConverter()
  @JsonKey(name: 'available_from')
  final DateTime? availableFrom;

  // Additional fields for UI
  final double? rating;
  final int? reviewCount;
  final String? name;
  @JsonKey(name: 'landlord_id')
  final String? landlordId;

  // Additional API fields
  final int? kitchens;
  final int? toilets;
  @JsonKey(name: 'listing_type')
  final dynamic listingType;
  final dynamic status;
  final dynamic street;
  @JsonKey(name: 'size_sqft')
  final double? sizeSqft;
  @JsonKey(name: 'year_built')
  final int? yearBuilt;
  final dynamic zipcode;
  @JsonKey(name: 'parking_type')
  final dynamic parkingType;
  @JsonKey(name: 'parking_spaces')
  final int? parkingSpaces;
  @JsonKey(name: 'parking_security')
  final dynamic parkingSecurity;
  @JsonKey(name: 'payment_structure')
  final dynamic paymentStructure;
  @JsonKey(name: 'minimum_lease_duration')
  final dynamic minimumLeaseDuration;
  @JsonKey(name: 'security_features')
  final List<String>? securityFeatures;
  @JsonKey(name: 'neighborhood_security')
  final dynamic neighborhoodSecurity;
  @JsonKey(name: 'verification_status')
  final dynamic verificationStatus;
  @JsonKey(name: 'video_tour')
  final dynamic videoTour;
  @JsonKey(name: 'water_source')
  final dynamic waterSource;
  @JsonKey(name: 'match_reason')
  final dynamic matchReason;
  @JsonKey(name: 'recommendation_score')
  final double? recommendationScore;
  @JsonKey(name: 'tenant_id')
  final String? tenantId;

  Property({
    required this.id,
    this.description,
    required this.address,
    required this.area,
    required this.city,
    this.state,
    this.latitude,
    this.longitude,
    this.agreementFee,
    this.cautionFee,
    this.rentAmount,
    this.bedrooms,
    this.bathrooms,
    this.categoryId,
    this.gallery,
    this.coverImage,
    this.isAvailable,
    this.isVerified,
    this.isFeatured,
    this.featuredUntil,
    this.featuredPriority,
    this.deleted = false,
    this.createdAt,
    this.updatedAt,
    this.closestLandmark,
    this.furnished,
    this.furnishingDetails,
    this.flagged,
    this.floorsNo,
    this.hasParking,
    this.hasWaterHeater,
    this.accessibilityFeatures,
    this.amenities,
    this.availableFrom,
    this.rating,
    this.reviewCount,
    this.name,
    this.landlordId,
    this.kitchens,
    this.toilets,
    this.listingType,
    this.status,
    this.street,
    this.sizeSqft,
    this.yearBuilt,
    this.zipcode,
    this.parkingType,
    this.parkingSpaces,
    this.parkingSecurity,
    this.paymentStructure,
    this.minimumLeaseDuration,
    this.securityFeatures,
    this.neighborhoodSecurity,
    this.verificationStatus,
    this.videoTour,
    this.waterSource,
    this.matchReason,
    this.recommendationScore,
    this.tenantId,
  });

  factory Property.fromJson(Map<String, dynamic> json) {
    try {
      // Safely handle gallery field - convert to List<String> if needed
      List<String>? gallery;
      final galleryData = json['gallery'];
      if (galleryData is List) {
        gallery = galleryData.map((e) => e.toString()).toList();
      } else if (galleryData is String) {
        gallery = [galleryData];
      }

      // Safely handle securityFeatures field
      List<String>? securityFeatures;
      final secFeatures = json['security_features'];
      if (secFeatures is List) {
        securityFeatures = secFeatures.map((e) => e.toString()).toList();
      } else if (secFeatures is String) {
        securityFeatures = [secFeatures];
      }

      // Create a cleaned copy of JSON with fixed gallery and security_features
      final cleanedJson = Map<String, dynamic>.from(json);
      cleanedJson['gallery'] = gallery;
      cleanedJson['security_features'] = securityFeatures;

      return _$PropertyFromJson(cleanedJson);
    } catch (e) {
      print(
        'Property.fromJson - Error parsing property. JSON keys: ${json.keys.toList()}',
      );
      print('Property.fromJson - Full JSON: $json');
      print('Property.fromJson - Error: $e');
      print('Property.fromJson - Stack trace: ${StackTrace.current}');
      rethrow;
    }
  }
  Map<String, dynamic> toJson() => _$PropertyToJson(this);

  String get fullAddress => '$address, $city${state != null ? ', $state' : ''}';

  // Use display name that matches API structure
  String get displayName => name ?? description?.split('\n')[0] ?? address;

  // Get price - prefer rent_amount, fall back to agreement_fee
  double get displayPrice => rentAmount ?? agreementFee ?? cautionFee ?? 0.0;

  // Safe getter for dynamic string fields
  String? _safeString(dynamic value) {
    if (value == null) return null;
    if (value is String) return value;
    return value.toString();
  }

  String? get listingTypeStr => _safeString(listingType);
  String? get statusStr => _safeString(status);
  String? get streetStr => _safeString(street);
  String? get zipcodeStr => _safeString(zipcode);
  String? get parkingTypeStr => _safeString(parkingType);
  String? get parkingSecurityStr => _safeString(parkingSecurity);
  String? get paymentStructureStr => _safeString(paymentStructure);
  String? get minimumLeaseDurationStr => _safeString(minimumLeaseDuration);
  String? get neighborhoodSecurityStr => _safeString(neighborhoodSecurity);
  String? get verificationStatusStr => _safeString(verificationStatus);
  String? get videoTourStr => _safeString(videoTour);
  String? get waterSourceStr => _safeString(waterSource);
  String? get matchReasonStr => _safeString(matchReason);
}
