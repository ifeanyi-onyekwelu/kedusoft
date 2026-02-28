import 'package:flutter/material.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/layouts/tenant_main_layout.dart';
import 'package:letsten/screens/tenant/tenant_dashboard_screen.dart';
import 'package:letsten/screens/tenant/browse_properties_screen.dart';
import 'package:letsten/screens/tenant/recommendations_screen.dart';
import 'package:letsten/screens/tenant/tenant_applications_screen.dart';
import 'package:letsten/screens/tenant/tenant_transactions_screen.dart';
import 'package:letsten/screens/tenant/tenant_screenings_screen.dart';
import 'package:letsten/screens/tenant/tenant_leases_screen.dart';
import 'package:letsten/screens/tenant/tenant_messages_screen.dart';
import 'package:letsten/screens/tenant/tenant_profile_screen.dart';
import 'package:letsten/screens/tenant/tenant_notifications_screen.dart';
import 'package:letsten/screens/tenant/tenant_payment_center_screen.dart';
import 'package:letsten/screens/tenant/saved_properties_screen.dart';
import 'package:letsten/screens/tenant/property_details_screen.dart';
import 'package:letsten/screens/empty_placeholder_screen.dart';

class TenantRoutes {
  static Route<dynamic>? generate(RouteSettings settings) {
    switch (settings.name) {
      // ── Dashboard & Home ────────────────────────────────
      case AppRoutes.tenantDashboard:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const TenantDashboardScreen(),
          ),
        );

      case AppRoutes.tenantRecentActivity:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const EmptyPlaceholderScreen(
              title: 'Recent Activity',
              icon: Icons.history,
            ),
          ),
        );

      // ── Property Management ─────────────────────────────
      case AppRoutes.tenantBrowseProperties:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 1,
            child: const BrowsePropertiesScreen(),
          ),
        );

      case AppRoutes.tenantPropertyDetails:
        final propertyId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => PropertyDetailsScreen(propertyId: propertyId ?? ''),
        );

      case AppRoutes.tenantFavorites:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 3,
            child: const SavedPropertiesScreen(),
          ),
        );

      case AppRoutes.tenantRecommendations:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 1,
            child: const RecommendationsScreen(),
          ),
        );

      // ── Applications ────────────────────────────────────
      case AppRoutes.tenantApplications:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 2,
            child: const TenantApplicationsScreen(),
          ),
        );

      case AppRoutes.tenantApplicationDetails:
        final applicationId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 2,
            child: EmptyPlaceholderScreen(
              title:
                  'Application Details${applicationId != null ? ' - $applicationId' : ''}',
              icon: Icons.assignment,
            ),
          ),
        );

      case AppRoutes.tenantSubmitApplication:
        final propertyId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 2,
            child: EmptyPlaceholderScreen(
              title:
                  'Submit Application${propertyId != null ? ' - $propertyId' : ''}',
              icon: Icons.assignment_turned_in,
            ),
          ),
        );

      // ── Financials & Payments ──────────────────────────
      case AppRoutes.tenantTransactions:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const TenantTransactionsScreen(),
          ),
        );

      case AppRoutes.tenantTransactionDetails:
        final transactionId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: EmptyPlaceholderScreen(
              title:
                  'Transaction Details${transactionId != null ? ' - $transactionId' : ''}',
              icon: Icons.receipt,
            ),
          ),
        );

      case AppRoutes.tenantPayments:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const TenantPaymentCenterScreen(),
          ),
        );

      case AppRoutes.tenantPaymentHistory:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const TenantPaymentCenterScreen(),
          ),
        );

      // ── Screenings & Documents ─────────────────────────
      case AppRoutes.tenantScreenings:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 2,
            child: const TenantScreeningsScreen(),
          ),
        );

      case AppRoutes.tenantScreeningDetails:
        final screeningId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 2,
            child: EmptyPlaceholderScreen(
              title:
                  'Screening Details${screeningId != null ? ' - $screeningId' : ''}',
              icon: Icons.verified_user,
            ),
          ),
        );

      // ── Leases ──────────────────────────────────────────
      case AppRoutes.tenantLeases:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 2,
            child: const TenantLeasesScreen(),
          ),
        );

      case AppRoutes.tenantLeaseDetails:
        final leaseId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 2,
            child: EmptyPlaceholderScreen(
              title: 'Lease Details${leaseId != null ? ' - $leaseId' : ''}',
              icon: Icons.description,
            ),
          ),
        );

      case AppRoutes.tenantSignLease:
        final leaseId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 2,
            child: EmptyPlaceholderScreen(
              title: 'Sign Lease${leaseId != null ? ' - $leaseId' : ''}',
              icon: Icons.edit,
            ),
          ),
        );

      // ── Messaging ───────────────────────────────────────
      case AppRoutes.tenantMessages:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 4,
            child: const TenantMessagesScreen(),
          ),
        );

      case AppRoutes.tenantChatDetails:
        final chatRoomId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 4,
            child: EmptyPlaceholderScreen(
              title: 'Chat${chatRoomId != null ? ' - $chatRoomId' : ''}',
              icon: Icons.chat,
            ),
          ),
        );

      // ── Profile & Account ───────────────────────────────
      case AppRoutes.tenantProfile:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const TenantProfileScreen(),
          ),
        );

      case AppRoutes.tenantEditProfile:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const EmptyPlaceholderScreen(
              title: 'Edit Profile',
              icon: Icons.edit,
            ),
          ),
        );

      case AppRoutes.tenantUploadProfilePicture:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const EmptyPlaceholderScreen(
              title: 'Upload Profile Picture',
              icon: Icons.photo_camera,
            ),
          ),
        );

      case AppRoutes.tenantUploadIdentityDocs:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const EmptyPlaceholderScreen(
              title: 'Upload Identity Documents',
              icon: Icons.file_present,
            ),
          ),
        );

      case AppRoutes.tenantChangePassword:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const EmptyPlaceholderScreen(
              title: 'Change Password',
              icon: Icons.lock,
            ),
          ),
        );

      case AppRoutes.tenantSettings:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const EmptyPlaceholderScreen(
              title: 'Settings',
              icon: Icons.settings,
            ),
          ),
        );

      case AppRoutes.tenantPauseAccount:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const EmptyPlaceholderScreen(
              title: 'Pause Account',
              icon: Icons.pause_circle,
            ),
          ),
        );

      case AppRoutes.tenantDeleteAccount:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const EmptyPlaceholderScreen(
              title: 'Delete Account',
              icon: Icons.delete_forever,
            ),
          ),
        );

      // ── Notifications ───────────────────────────────────
      case AppRoutes.tenantNotifications:
        return MaterialPageRoute(
          builder: (_) => TenantMainLayout(
            initialIndex: 0,
            child: const TenantNotificationsScreen(),
          ),
        );

      default:
        return null;
    }
  }
}
