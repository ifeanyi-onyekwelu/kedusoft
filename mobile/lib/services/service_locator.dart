// Service Locator for Dependency Injection
import 'http_client.dart';
import 'auth_service.dart';
import 'property_service.dart';
import 'tenant_service.dart';
import 'profile_service.dart';

class ServiceLocator {
  static final ServiceLocator _instance = ServiceLocator._internal();

  factory ServiceLocator() {
    return _instance;
  }

  ServiceLocator._internal();

  late HttpClient _httpClient;
  late AuthService _authService;
  late PropertyService _propertyService;
  late TenantService _tenantService;
  late ProfileService _profileService;

  // Initialize all services
  void initialize() {
    _httpClient = HttpClient();
    _authService = AuthService(_httpClient);
    _propertyService = PropertyService(_httpClient);
    _tenantService = TenantService(_httpClient);
    _profileService = ProfileService(_httpClient);
  }

  // Getters
  HttpClient get httpClient => _httpClient;
  AuthService get authService => _authService;
  PropertyService get propertyService => _propertyService;
  TenantService get tenantService => _tenantService;
  ProfileService get profileService => _profileService;
}

// Global instance
final serviceLocator = ServiceLocator();
