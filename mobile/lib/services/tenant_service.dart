import 'http_client.dart';
import 'api_config.dart';
import '../models/application_model.dart';
import '../models/screening_model.dart';
import '../models/lease_model.dart';
import '../models/transaction_model.dart';
import '../models/property_model.dart';

class TenantService {
  final HttpClient httpClient;

  TenantService(this.httpClient);

  // Applications
  Future<void> submitApplication(String propertyId) async {
    try {
      await httpClient.post(
        '${ApiConfig.tenantApplicationsEndpoint}/$propertyId/applications',
        data: {},
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Application>> getAllApplications() async {
    try {
      return await httpClient.get<List<Application>>(
        ApiConfig.tenantApplicationsEndpoint,
        fromJson: (json) {
          if (json is List) {
            return json.map((item) => Application.fromJson(item)).toList();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<Application> getApplicationDetails(String applicationId) async {
    try {
      return await httpClient.get<Application>(
        '${ApiConfig.tenantApplicationsEndpoint}/$applicationId',
        fromJson: (json) => Application.fromJson(json),
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> deleteApplication(String applicationId) async {
    try {
      await httpClient.delete(
        '${ApiConfig.tenantApplicationsEndpoint}/$applicationId',
      );
    } catch (e) {
      rethrow;
    }
  }

  // Screenings
  Future<List<Screening>> getAllScreenings() async {
    try {
      return await httpClient.get<List<Screening>>(
        ApiConfig.tenantScreeningsEndpoint,
        fromJson: (json) {
          if (json is List) {
            return json.map((item) => Screening.fromJson(item)).toList();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<Screening> getScreeningDetails(String screeningId) async {
    try {
      return await httpClient.get<Screening>(
        '${ApiConfig.tenantScreeningsEndpoint}/$screeningId',
        fromJson: (json) => Screening.fromJson(json),
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> acceptScreening(String screeningId) async {
    try {
      await httpClient.post(
        '${ApiConfig.tenantScreeningsEndpoint}/$screeningId/accept',
        data: {},
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> declineScreening(String screeningId) async {
    try {
      await httpClient.post(
        '${ApiConfig.tenantScreeningsEndpoint}/$screeningId/decline',
        data: {},
      );
    } catch (e) {
      rethrow;
    }
  }

  // Leases
  Future<List<Lease>> getActiveLeas() async {
    try {
      return await httpClient.get<List<Lease>>(
        ApiConfig.tenantLeasesEndpoint,
        fromJson: (json) {
          if (json is List) {
            return json.map((item) => Lease.fromJson(item)).toList();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Lease>> getAllLeases() async {
    try {
      return await httpClient.get<List<Lease>>(
        '${ApiConfig.tenantLeasesEndpoint}?all=true',
        fromJson: (json) {
          if (json is List) {
            return json.map((item) => Lease.fromJson(item)).toList();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> signLease(String leaseId, String signature) async {
    try {
      await httpClient.post(
        '${ApiConfig.tenantLeasesEndpoint}/$leaseId/sign',
        data: {'signature': signature},
      );
    } catch (e) {
      rethrow;
    }
  }

  // Transactions
  Future<List<Transaction>> getTransactions() async {
    try {
      return await httpClient.get<List<Transaction>>(
        ApiConfig.tenantTransactionsEndpoint,
        fromJson: (json) {
          if (json is List) {
            return json.map((item) => Transaction.fromJson(item)).toList();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<Transaction> getTransactionDetails(String transactionId) async {
    try {
      return await httpClient.get<Transaction>(
        '${ApiConfig.tenantTransactionsEndpoint}/$transactionId',
        fromJson: (json) => Transaction.fromJson(json),
      );
    } catch (e) {
      rethrow;
    }
  }

  // Liked/Saved Properties
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

  Future<void> unlikeProperty(String likeId) async {
    try {
      await httpClient.delete(
        '${ApiConfig.tenantLikedPropertiesEndpoint}/$likeId/unlike',
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

  // Recommendations
  Future<List<Property>> getRecommendedProperties({
    int page = 1,
    int perPage = 10,
  }) async {
    try {
      return await httpClient.get<List<Property>>(
        '${ApiConfig.tenantRecommendationsEndpoint}/properties?page=$page&per_page=$perPage',
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

  Future<void> createRecommendation(Map<String, dynamic> data) async {
    try {
      await httpClient.post(
        ApiConfig.tenantRecommendationsEndpoint,
        data: data,
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> updateRecommendation(
    String recommendationId,
    Map<String, dynamic> data,
  ) async {
    try {
      await httpClient.put(
        '${ApiConfig.tenantRecommendationsEndpoint}/$recommendationId',
        data: data,
      );
    } catch (e) {
      rethrow;
    }
  }

  // Search History
  Future<List<Map<String, dynamic>>> getSearchHistory() async {
    try {
      return await httpClient.get<List<Map<String, dynamic>>>(
        '/tenant/search-history',
        fromJson: (json) {
          if (json is List) {
            return json.cast<Map<String, dynamic>>();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> clearSearchHistory() async {
    try {
      await httpClient.delete('/tenant/search-history');
    } catch (e) {
      rethrow;
    }
  }

  // Recent Activities
  Future<List<Map<String, dynamic>>> getRecentActivities({
    int limit = 10,
    int days = 30,
  }) async {
    try {
      return await httpClient.get<List<Map<String, dynamic>>>(
        '${ApiConfig.tenantActivitiesEndpoint}?limit=$limit&days=$days',
        fromJson: (json) {
          if (json is List) {
            return json.cast<Map<String, dynamic>>();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  // Apply for Property
  Future<void> applyForProperty(
    String propertyId,
    Map<String, dynamic> data,
  ) async {
    try {
      await httpClient.post(
        '/tenant/properties/$propertyId/applications',
        data: data,
      );
    } catch (e) {
      rethrow;
    }
  }

  // Download Application
  Future<dynamic> downloadApplication(String applicationId) async {
    try {
      return await httpClient.get(
        '${ApiConfig.tenantApplicationsEndpoint}/$applicationId/download',
      );
    } catch (e) {
      rethrow;
    }
  }

  // Notifications for screenings
  Future<List<Map<String, dynamic>>> getScreeningNotifications() async {
    try {
      return await httpClient.get<List<Map<String, dynamic>>>(
        '/tenant/screenings/notifications',
        fromJson: (json) {
          if (json is List) {
            return json.cast<Map<String, dynamic>>();
          }
          return [];
        },
      );
    } catch (e) {
      rethrow;
    }
  }
}
