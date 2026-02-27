import 'http_client.dart';
import 'api_config.dart';
import '../models/property_model.dart';

class PropertyService {
  final HttpClient httpClient;

  PropertyService(this.httpClient);

  Future<List<Property>> getAllProperties({
    int page = 1,
    int pageSize = 20,
    String? search,
    String? city,
    String? state,
    double? minRent,
    double? maxRent,
    int? bedrooms,
    int? bathrooms,
  }) async {
    try {
      final queryParams = {
        'page': page,
        'pageSize': pageSize,
        if (search != null) 'search': search,
        if (city != null) 'city': city,
        if (state != null) 'state': state,
        if (minRent != null) 'minRent': minRent,
        if (maxRent != null) 'maxRent': maxRent,
        if (bedrooms != null) 'bedrooms': bedrooms,
        if (bathrooms != null) 'bathrooms': bathrooms,
      };

      return await httpClient.get<List<Property>>(
        ApiConfig.publicPropertiesEndpoint,
        queryParameters: queryParams,
        fromJson: (json) {
          if (json is List) {
            return json.map((item) => Property.fromJson(item)).toList();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<Property> getPropertyDetails(String propertyId) async {
    try {
      return await httpClient.get<Property>(
        '${ApiConfig.publicPropertiesEndpoint}/$propertyId',
        fromJson: (json) => Property.fromJson(json),
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Property>> getFeaturedProperties() async {
    try {
      return await httpClient.get<List<Property>>(
        ApiConfig.featuredPropertiesEndpoint,
        fromJson: (json) {
          if (json is List) {
            return json.map((item) => Property.fromJson(item)).toList();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Property>> getLatestProperties() async {
    try {
      return await httpClient.get<List<Property>>(
        ApiConfig.latestPropertiesEndpoint,
        fromJson: (json) {
          if (json is List) {
            return json.map((item) => Property.fromJson(item)).toList();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Property>> getNearbyProperties({
    required double latitude,
    required double longitude,
    double radiusInKm = 10,
  }) async {
    try {
      return await httpClient.get<List<Property>>(
        ApiConfig.nearbyPropertiesEndpoint,
        queryParameters: {
          'latitude': latitude,
          'longitude': longitude,
          'radius': radiusInKm,
        },
        fromJson: (json) {
          if (json is List) {
            return json.map((item) => Property.fromJson(item)).toList();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Property>> getRecommendedProperties() async {
    try {
      return await httpClient.get<List<Property>>(
        ApiConfig.recommendedPropertiesEndpoint,
        fromJson: (json) {
          if (json is List) {
            return json.map((item) => Property.fromJson(item)).toList();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Property>> searchProperties(String query) async {
    try {
      return await httpClient.get<List<Property>>(
        ApiConfig.searchPropertiesEndpoint,
        queryParameters: {'q': query},
        fromJson: (json) {
          if (json is List) {
            return json.map((item) => Property.fromJson(item)).toList();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  // Like/Unlike methods for tenant users
  Future<void> likeProperty(String propertyId) async {
    try {
      await httpClient.post(
        '${ApiConfig.tenantLikedPropertiesEndpoint}/$propertyId/like',
        data: {},
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> unlikeProperty(String propertyId) async {
    try {
      await httpClient.delete(
        '${ApiConfig.tenantLikedPropertiesEndpoint}/$propertyId/unlike',
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<bool> isPropertyLiked(String propertyId) async {
    try {
      final result = await httpClient.get<Map<String, dynamic>>(
        '${ApiConfig.tenantLikedPropertiesEndpoint}/$propertyId/like-status',
        fromJson: (json) => json as Map<String, dynamic>,
      );
      return result['liked'] ?? false;
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Property>> getLikedProperties() async {
    try {
      return await httpClient.get<List<Property>>(
        ApiConfig.tenantLikedPropertiesEndpoint,
        fromJson: (json) {
          if (json is List) {
            return json.map((item) => Property.fromJson(item)).toList();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }
}
