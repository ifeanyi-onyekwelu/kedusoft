import 'package:flutter/material.dart';
import '../models/application_model.dart';
import '../models/lease_model.dart';
import '../models/transaction_model.dart';
import '../models/property_model.dart';
import '../models/screening_model.dart';
import '../services/service_locator.dart';

class TenantProvider extends ChangeNotifier {
  // Services
  final tenantService = serviceLocator.tenantService;

  // Applications
  List<Application> _applications = [];
  bool _applicationsLoading = false;
  String? _applicationsError;

  // Transactions
  List<Transaction> _transactions = [];
  bool _transactionsLoading = false;
  String? _transactionsError;

  // Leases
  List<Lease> _leases = [];
  bool _leasesLoading = false;
  String? _leasesError;

  // Liked Properties
  List<Property> _likedProperties = [];
  bool _likedPropertiesLoading = false;
  String? _likedPropertiesError;

  // Screenings
  List<Screening> _screenings = [];
  bool _screeningsLoading = false;
  String? _screeningsError;

  // Recommended Properties
  List<Property> _recommendedProperties = [];
  bool _recommendedPropertiesLoading = false;
  String? _recommendedPropertiesError;

  // Recent Activities
  List<Map<String, dynamic>> _recentActivities = [];
  bool _activitiesLoading = false;
  String? _activitiesError;

  // Getters
  List<Application> get applications => _applications;
  bool get applicationsLoading => _applicationsLoading;
  String? get applicationsError => _applicationsError;

  List<Transaction> get transactions => _transactions;
  bool get transactionsLoading => _transactionsLoading;
  String? get transactionsError => _transactionsError;

  List<Lease> get leases => _leases;
  bool get leasesLoading => _leasesLoading;
  String? get leasesError => _leasesError;

  List<Property> get likedProperties => _likedProperties;
  bool get likedPropertiesLoading => _likedPropertiesLoading;
  String? get likedPropertiesError => _likedPropertiesError;

  List<Screening> get screenings => _screenings;
  bool get screeningsLoading => _screeningsLoading;
  String? get screeningsError => _screeningsError;

  List<Property> get recommendedProperties => _recommendedProperties;
  bool get recommendedPropertiesLoading => _recommendedPropertiesLoading;
  String? get recommendedPropertiesError => _recommendedPropertiesError;

  List<Map<String, dynamic>> get recentActivities => _recentActivities;
  bool get activitiesLoading => _activitiesLoading;
  String? get activitiesError => _activitiesError;

  // APPLICATIONS
  Future<void> fetchApplications() async {
    _applicationsLoading = true;
    _applicationsError = null;
    notifyListeners();

    try {
      _applications = await tenantService.getAllApplications();
      _applicationsError = null;
    } catch (e) {
      _applicationsError = e.toString();
    } finally {
      _applicationsLoading = false;
      notifyListeners();
    }
  }

  Future<Application?> getApplicationDetails(String applicationId) async {
    try {
      return await tenantService.getApplicationDetails(applicationId);
    } catch (e) {
      _applicationsError = e.toString();
      notifyListeners();
      return null;
    }
  }

  Future<bool> deleteApplication(String applicationId) async {
    try {
      await tenantService.deleteApplication(applicationId);
      _applications.removeWhere((app) => app.id == applicationId);
      notifyListeners();
      return true;
    } catch (e) {
      _applicationsError = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> applyForProperty(
    String propertyId,
    Map<String, dynamic> data,
  ) async {
    try {
      await tenantService.applyForProperty(propertyId, data);
      await fetchApplications(); // Refresh list
      return true;
    } catch (e) {
      _applicationsError = e.toString();
      notifyListeners();
      return false;
    }
  }

  // TRANSACTIONS
  Future<void> fetchTransactions() async {
    _transactionsLoading = true;
    _transactionsError = null;
    notifyListeners();

    try {
      _transactions = await tenantService.getTransactions();
      _transactionsError = null;
    } catch (e) {
      _transactionsError = e.toString();
    } finally {
      _transactionsLoading = false;
      notifyListeners();
    }
  }

  Future<Transaction?> getTransactionDetails(String transactionId) async {
    try {
      return await tenantService.getTransactionDetails(transactionId);
    } catch (e) {
      _transactionsError = e.toString();
      notifyListeners();
      return null;
    }
  }

  // LEASES
  Future<void> fetchLeases() async {
    _leasesLoading = true;
    _leasesError = null;
    notifyListeners();

    try {
      _leases = await tenantService.getActiveLeas();
      _leasesError = null;
    } catch (e) {
      _leasesError = e.toString();
    } finally {
      _leasesLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchAllLeases() async {
    _leasesLoading = true;
    _leasesError = null;
    notifyListeners();

    try {
      _leases = await tenantService.getAllLeases();
      _leasesError = null;
    } catch (e) {
      _leasesError = e.toString();
    } finally {
      _leasesLoading = false;
      notifyListeners();
    }
  }

  Future<bool> signLease(String leaseId, String signature) async {
    try {
      await tenantService.signLease(leaseId, signature);
      await fetchLeases(); // Refresh list
      return true;
    } catch (e) {
      _leasesError = e.toString();
      notifyListeners();
      return false;
    }
  }

  // LIKED PROPERTIES
  Future<void> fetchLikedProperties() async {
    _likedPropertiesLoading = true;
    _likedPropertiesError = null;
    notifyListeners();

    try {
      _likedProperties = await tenantService.getLikedProperties();
      _likedPropertiesError = null;
    } catch (e) {
      _likedPropertiesError = e.toString();
    } finally {
      _likedPropertiesLoading = false;
      notifyListeners();
    }
  }

  Future<bool> toggleLikeProperty(String propertyId) async {
    try {
      // Check if already liked
      final isLiked = await tenantService.isPropertyLiked(propertyId);

      if (isLiked) {
        await tenantService.unlikeProperty(propertyId);
      } else {
        await tenantService.likeProperty(propertyId);
      }

      // Refresh the list
      await fetchLikedProperties();
      return !isLiked; // Return the new state
    } catch (e) {
      _likedPropertiesError = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> likeProperty(String propertyId) async {
    try {
      await tenantService.likeProperty(propertyId);
      return true;
    } catch (e) {
      _likedPropertiesError = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> unlikeProperty(String propertyId) async {
    try {
      await tenantService.unlikeProperty(propertyId);
      return true;
    } catch (e) {
      _likedPropertiesError = e.toString();
      notifyListeners();
      return false;
    }
  }

  // SCREENINGS
  Future<void> fetchScreenings() async {
    _screeningsLoading = true;
    _screeningsError = null;
    notifyListeners();

    try {
      _screenings = await tenantService.getAllScreenings();
      _screeningsError = null;
    } catch (e) {
      _screeningsError = e.toString();
    } finally {
      _screeningsLoading = false;
      notifyListeners();
    }
  }

  Future<Screening?> getScreeningDetails(String screeningId) async {
    try {
      return await tenantService.getScreeningDetails(screeningId);
    } catch (e) {
      _screeningsError = e.toString();
      notifyListeners();
      return null;
    }
  }

  Future<bool> acceptScreening(String screeningId) async {
    try {
      await tenantService.acceptScreening(screeningId);
      await fetchScreenings(); // Refresh list
      return true;
    } catch (e) {
      _screeningsError = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> declineScreening(String screeningId) async {
    try {
      await tenantService.declineScreening(screeningId);
      await fetchScreenings(); // Refresh list
      return true;
    } catch (e) {
      _screeningsError = e.toString();
      notifyListeners();
      return false;
    }
  }

  // RECOMMENDED PROPERTIES
  Future<void> fetchRecommendedProperties({
    int page = 1,
    int perPage = 10,
  }) async {
    _recommendedPropertiesLoading = true;
    _recommendedPropertiesError = null;
    notifyListeners();

    try {
      _recommendedProperties = await tenantService.getRecommendedProperties(
        page: page,
        perPage: perPage,
      );
      _recommendedPropertiesError = null;
    } catch (e) {
      _recommendedPropertiesError = e.toString();
    } finally {
      _recommendedPropertiesLoading = false;
      notifyListeners();
    }
  }

  // RECENT ACTIVITIES
  Future<void> fetchRecentActivities({int limit = 10, int days = 30}) async {
    _activitiesLoading = true;
    _activitiesError = null;
    notifyListeners();

    try {
      _recentActivities = await tenantService.getRecentActivities(
        limit: limit,
        days: days,
      );
      _activitiesError = null;
    } catch (e) {
      _activitiesError = e.toString();
    } finally {
      _activitiesLoading = false;
      notifyListeners();
    }
  }

  // Utility methods
  bool isPropertyLiked(String propertyId) {
    try {
      return _likedProperties.any((p) => p.id == propertyId);
    } catch (e) {
      return false;
    }
  }

  void clearErrors() {
    _applicationsError = null;
    _transactionsError = null;
    _leasesError = null;
    _likedPropertiesError = null;
    _screeningsError = null;
    _recommendedPropertiesError = null;
    _activitiesError = null;
    notifyListeners();
  }
}
