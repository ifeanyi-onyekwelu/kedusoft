class AppRoutes {
  // ══════════════════════════════════════════════════════════════
  // AUTH ROUTES
  // ══════════════════════════════════════════════════════════════
  static const String splash = '/';
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String roleSelection = '/auth/role-selection';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';
  static const String emailVerification = '/auth/email-verification';

  // ══════════════════════════════════════════════════════════════
  // PUBLIC ROUTES (No Authentication Required)
  // ══════════════════════════════════════════════════════════════

  // Home & Browsing
  static const String home = '/home';
  static const String searchResults = '/properties/search';
  static const String browseProperties = '/properties';
  static const String propertyDetails = '/properties/:propertyId';
  static const String propertyMapView = '/properties/map';
  static const String propertyComparison = '/properties/compare';
  static const String featuredProperties = '/properties/featured';
  static const String latestProperties = '/properties/latest';
  static const String recommendedProperties = '/properties/recommended';
  static const String shortletsPage = '/properties/shortlets';

  // Educational Content
  static const String howItWorks = '/how-it-works';
  static const String tenantGuide = '/tenant-guide';
  static const String howToApply = '/how-to-apply';
  static const String agentPage = '/agent';
  static const String propertyManagementInfo = '/property-management-info';

  // Resources & Information
  static const String blog = '/blog';
  static const String marketInsights = '/market-insights';
  static const String mortgageCalculator = '/mortgage-calculator';
  static const String faqs = '/faqs';
  static const String contactUs = '/contact-us';
  static const String aboutUs = '/about-us';

  // Legal & Policies
  static const String privacyPolicy = '/privacy-policy';
  static const String termsOfService = '/terms-of-service';
  static const String fairHousing = '/fair-housing';
  static const String cookiePolicy = '/cookie-policy';
  static const String resourcesHub = '/resources';

  // ══════════════════════════════════════════════════════════════
  // TENANT ROUTES
  // ══════════════════════════════════════════════════════════════

  // Dashboard & Home
  static const String tenantDashboard = '/tenant/dashboard';
  static const String tenantRecentActivity = '/tenant/recent-activity';

  // Property Management
  static const String tenantBrowseProperties = '/tenant/browse-properties';
  static const String tenantPropertyDetails = '/tenant/properties/:propertyId';
  static const String tenantFavorites = '/tenant/favorites';
  static const String tenantRecommendations = '/tenant/recommendations';

  // Applications
  static const String tenantApplications = '/tenant/applications';
  static const String tenantApplicationDetails =
      '/tenant/applications/:applicationId';
  static const String tenantSubmitApplication = '/tenant/apply/:propertyId';

  // Financials & Payments
  static const String tenantTransactions = '/tenant/transactions';
  static const String tenantTransactionDetails =
      '/tenant/transactions/:transactionId';
  static const String tenantPayments = '/tenant/payments';
  static const String tenantPaymentHistory = '/tenant/payment-history';

  // Screenings & Documents
  static const String tenantScreenings = '/tenant/screenings';
  static const String tenantScreeningDetails =
      '/tenant/screenings/:screeningId';

  // Leases
  static const String tenantLeases = '/tenant/leases';
  static const String tenantLeaseDetails = '/tenant/leases/:leaseId';
  static const String tenantSignLease = '/tenant/leases/:leaseId/sign';

  // Messaging
  static const String tenantMessages = '/tenant/messages';
  static const String tenantChatDetails = '/tenant/chat/:chatRoomId';

  // Profile & Account
  static const String tenantProfile = '/tenant/profile';
  static const String tenantEditProfile = '/tenant/profile/edit';
  static const String tenantUploadProfilePicture =
      '/tenant/profile/upload-picture';
  static const String tenantUploadIdentityDocs = '/tenant/profile/upload-docs';
  static const String tenantChangePassword = '/tenant/profile/change-password';
  static const String tenantSettings = '/tenant/settings';
  static const String tenantPauseAccount = '/tenant/pause-account';
  static const String tenantDeleteAccount = '/tenant/delete-account';

  // Notifications
  static const String tenantNotifications = '/tenant/notifications';

  // ══════════════════════════════════════════════════════════════
  // LANDLORD ROUTES
  // ══════════════════════════════════════════════════════════════

  // Dashboard & Home
  static const String landlordDashboard = '/landlord/dashboard';
  static const String landlordRecentActivity = '/landlord/recent-activity';
  static const String landlordAlerts = '/landlord/alerts';

  // Property Management
  static const String landlordProperties = '/landlord/properties';
  static const String landlordPropertyDetails =
      '/landlord/properties/:propertyId';
  static const String landlordCreateProperty = '/landlord/properties/create';
  static const String landlordEditProperty =
      '/landlord/properties/:propertyId/edit';
  static const String landlordPropertyDrafts = '/landlord/properties/drafts';
  static const String landlordPropertyAnalytics =
      '/landlord/properties/:propertyId/analytics';
  static const String landlordPropertyPerformance =
      '/landlord/properties/:propertyId/performance';

  // Applications Management
  static const String landlordApplications = '/landlord/applications';
  static const String landlordApplicationDetails =
      '/landlord/applications/:applicationId';
  static const String landlordApplicants = '/landlord/applicants';
  static const String landlordApplicantDetails =
      '/landlord/applicants/:applicantId';
  static const String landlordApplicationStats =
      '/landlord/applications/statistics';

  // Screening
  static const String landlordScreenings = '/landlord/screenings';
  static const String landlordScreeningDetails =
      '/landlord/screenings/:screeningId';
  static const String landlordCreateScreening =
      '/landlord/screenings/create/:applicationId';

  // Lease Management
  static const String landlordLeases = '/landlord/leases';
  static const String landlordLeaseDetails = '/landlord/leases/:leaseId';
  static const String landlordCreateLease =
      '/landlord/leases/create/:applicationId';
  static const String landlordSignLease = '/landlord/leases/:leaseId/sign';

  // Tenant Management
  static const String landlordTenants = '/landlord/tenants';
  static const String landlordTenantDetails = '/landlord/tenants/:tenantId';
  static const String landlordTenantStats = '/landlord/tenants/statistics';

  // Financial Management
  static const String landlordTransactions = '/landlord/transactions';
  static const String landlordTransactionDetails =
      '/landlord/transactions/:transactionId';
  static const String landlordTransactionStats =
      '/landlord/transactions/statistics';
  static const String landlordFinancialOverview =
      '/landlord/financial-overview';
  static const String landlordRevenueChart = '/landlord/revenue-chart';
  static const String landlordOccupancyStats = '/landlord/occupancy-stats';

  // Maintenance Management
  static const String landlordMaintenance = '/landlord/maintenance';
  static const String landlordMaintenanceDetails =
      '/landlord/maintenance/:maintenanceId';
  static const String landlordCreateMaintenance =
      '/landlord/maintenance/create';
  static const String landlordMaintenanceStats =
      '/landlord/maintenance/statistics';

  // Inspections
  static const String landlordInspections = '/landlord/inspections';
  static const String landlordInspectionDetails =
      '/landlord/inspections/:inspectionId';
  static const String landlordScheduleInspection =
      '/landlord/inspections/schedule';
  static const String landlordInspectionStats =
      '/landlord/inspections/statistics';

  // Reports
  static const String landlordReports = '/landlord/reports';
  static const String landlordReportDetails = '/landlord/reports/:reportId';
  static const String landlordCreateReport = '/landlord/reports/create';

  // Messaging
  static const String landlordMessages = '/landlord/messages';
  static const String landlordChatDetails = '/landlord/chat/:chatRoomId';

  // Profile & Account
  static const String landlordProfile = '/landlord/profile';
  static const String landlordEditProfile = '/landlord/profile/edit';
  static const String landlordUploadProfilePicture =
      '/landlord/profile/upload-picture';
  static const String landlordUploadIdentityDocs =
      '/landlord/profile/upload-docs';
  static const String landlordRequestVerification =
      '/landlord/profile/request-verification';
  static const String landlordChangePassword =
      '/landlord/profile/change-password';
  static const String landlordSettings = '/landlord/settings';
  static const String landlordPauseAccount = '/landlord/pause-account';
  static const String landlordDeleteAccount = '/landlord/delete-account';
}
