class ApiConfig {
  // Change this to your API base URL
  // static const String baseUrl = 'https://api.letsten.com/api';
  static const String baseUrl = 'http://10.0.2.2:5000/api/v1';

  static const Duration connectionTimeout = Duration(milliseconds: 30000);
  static const Duration receiveTimeout = Duration(milliseconds: 30000);

  // Endpoints
  static const String loginEndpoint = '/auth/';
  static const String signupEndpoint = '/auth/signup';
  static const String logoutEndpoint = '/auth/logout';
  static const String verifyEmailEndpoint = '/auth/verify-email';
  static const String sendVerificationEndpoint = '/auth/send-verification';
  static const String forgotPasswordEndpoint = '/auth/forgot-password';
  static const String resetPasswordEndpoint = '/auth/reset-password';

  // Profile
  static const String profileEndpoint = '/profile/';
  static const String changePasswordEndpoint = '/profile/change-password/';
  static const String uploadProfilePictureEndpoint =
      '/profile/upload-profile-picture';
  static const String uploadIdentityDocsEndpoint =
      '/profile/upload-identity-docs';
  static const String pauseAccountEndpoint = '/profile/pause';
  static const String resumeAccountEndpoint = '/profile/resume';
  static const String deleteAccountEndpoint = '/profile/delete';

  // Public Properties
  static const String publicPropertiesEndpoint = '/public/properties';
  static const String featuredPropertiesEndpoint =
      '/public/properties/featured';
  static const String latestPropertiesEndpoint = '/public/properties/latest';
  static const String nearbyPropertiesEndpoint = '/public/properties/nearby';
  static const String recommendedPropertiesEndpoint =
      '/public/properties/recommended';
  static const String searchPropertiesEndpoint = '/public/properties/search';

  // Tenant
  static const String tenantApplicationsEndpoint = '/tenant/applications';
  static const String tenantScreeningsEndpoint = '/tenant/screenings';
  static const String tenantLeasesEndpoint = '/tenant/leases';
  static const String tenantTransactionsEndpoint = '/tenant/transactions';
  static const String tenantLikedPropertiesEndpoint =
      '/tenant/properties/liked';
  static const String tenantRecommendationsEndpoint = '/tenant/recommendations';
  static const String tenantActivitiesEndpoint = '/tenant/activities/recent';
  static const String tenantNotificationsEndpoint =
      '/tenant/notifications/screenings';

  // Landlord
  static const String landlordPropertiesEndpoint = '/landlord/properties';
  static const String landlordApplicationsEndpoint = '/landlord/applications';
  static const String landlordScreeningsEndpoint = '/landlord/screenings';
  static const String landlordLeasesEndpoint = '/landlord/leases';
  static const String landlordTenantsEndpoint = '/landlord/tenants';
  static const String landlordTransactionsEndpoint = '/landlord/transactions';
  static const String landlordMaintenanceEndpoint = '/landlord/maintenance';
  static const String landlordInspectionsEndpoint = '/landlord/inspections';
  static const String landlordReportsEndpoint = '/landlord/reports';

  // Messaging
  static const String chatRoomsEndpoint = '/messaging/chat-rooms';
  static const String messagesEndpoint = '/messaging/chat-rooms';
}
