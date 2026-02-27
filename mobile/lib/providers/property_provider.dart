import 'package:flutter/material.dart';
import 'package:letsten/models/property_model.dart';
import '../services/service_locator.dart';

class PropertyProvider extends ChangeNotifier {
  final propertyService = serviceLocator.propertyService;
  final tenantService = serviceLocator.tenantService;

  // State
  List<Property> _properties = [];
  List<Property> _likedProperties = [];
  Map<String, bool> _likedStatusMap = {};
  bool _isLoading = false;
  String? _error;
  bool _isLikingProperty = false;

  // Getters
  List<Property> get properties => _properties;
  List<Property> get likedProperties => _likedProperties;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLikingProperty => _isLikingProperty;

  // Check if property is liked
  bool isPropertyLiked(String propertyId) {
    return _likedStatusMap[propertyId] ?? false;
  }

  // Fetch recommended properties
  Future<void> fetchRecommendedProperties() async {
    _isLoading = true;
    _error = null;
    try {
      _properties = await propertyService.getRecommendedProperties();

      // Fetch like status for all properties
      for (var property in _properties) {
        try {
          final isLiked = await propertyService.isPropertyLiked(property.id);
          _likedStatusMap[property.id] = isLiked;
        } catch (e) {
          _likedStatusMap[property.id] = false;
        }
      }
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    } finally {
      _isLoading = false;
    }
  }

  // Fetch all properties
  Future<void> fetchAllProperties({
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
    _isLoading = true;
    _error = null;
    try {
      _properties = await propertyService.getAllProperties(
        page: page,
        pageSize: pageSize,
        search: search,
        city: city,
        state: state,
        minRent: minRent,
        maxRent: maxRent,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
      );

      // Fetch like status for all properties
      for (var property in _properties) {
        try {
          final isLiked = await propertyService.isPropertyLiked(property.id);
          _likedStatusMap[property.id] = isLiked;
        } catch (e) {
          _likedStatusMap[property.id] = false;
        }
      }
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    } finally {
      _isLoading = false;
    }
  }

  // Fetch liked properties
  Future<void> fetchLikedProperties() async {
    _isLoading = true;
    _error = null;
    try {
      _likedProperties = await propertyService.getLikedProperties();
      // Mark all these properties as liked
      for (var property in _likedProperties) {
        _likedStatusMap[property.id] = true;
      }
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    } finally {
      _isLoading = false;
    }
  }

  // Toggle like/unlike property
  Future<void> toggleLikeProperty(String propertyId) async {
    final currentStatus = _likedStatusMap[propertyId] ?? false;

    // Optimistic update
    _isLikingProperty = true;
    _likedStatusMap[propertyId] = !currentStatus;
    notifyListeners();

    try {
      if (currentStatus) {
        // Unlike property
        await tenantService.unlikeProperty(propertyId);
      } else {
        // Like property
        await tenantService.likeProperty(propertyId);
      }
      notifyListeners();
    } catch (e) {
      // Revert on error
      _likedStatusMap[propertyId] = currentStatus;
      _error = e.toString();
      notifyListeners();
      rethrow;
    } finally {
      _isLikingProperty = false;
    }
  }

  // Like property
  Future<void> likeProperty(String propertyId) async {
    if (_likedStatusMap[propertyId] ?? false) {
      return; // Already liked
    }

    _isLikingProperty = true;
    notifyListeners();

    try {
      await tenantService.likeProperty(propertyId);
      _likedStatusMap[propertyId] = true;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      rethrow;
    } finally {
      _isLikingProperty = false;
    }
  }

  // Unlike property
  Future<void> unlikeProperty(String propertyId) async {
    if (!(_likedStatusMap[propertyId] ?? false)) {
      return; // Already unliked
    }

    _isLikingProperty = true;
    notifyListeners();

    try {
      await tenantService.unlikeProperty(propertyId);
      _likedStatusMap[propertyId] = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      rethrow;
    } finally {
      _isLikingProperty = false;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
