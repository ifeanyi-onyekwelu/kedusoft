import 'package:flutter/material.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/layouts/landlord_main_layout.dart';
import 'package:letsten/screens/landlord/landlord_dashboard_screen.dart';
import 'package:letsten/screens/empty_placeholder_screen.dart';

class LandlordRoutes {
  static Route<dynamic>? generate(RouteSettings settings) {
    switch (settings.name) {
      // ── Dashboard & Home ────────────────────────────────
      case AppRoutes.landlordDashboard:
        return MaterialPageRoute(
          builder: (_) => LandlordMainLayout(
            initialIndex: 0,
            child: const LandlordDashboardScreen(),
          ),
        );

      case AppRoutes.landlordRecentActivity:
        return MaterialPageRoute(
          builder: (_) => LandlordMainLayout(
            initialIndex: 0,
            child: const EmptyPlaceholderScreen(
              title: 'Recent Activity',
              icon: Icons.history,
            ),
          ),
        );

      case AppRoutes.landlordAlerts:
        return MaterialPageRoute(
          builder: (_) => LandlordMainLayout(
            initialIndex: 0,
            child: const EmptyPlaceholderScreen(
              title: 'Alerts & Notifications',
              icon: Icons.notifications,
            ),
          ),
        );

      // ── Property Management ─────────────────────────────
      case AppRoutes.landlordProperties:
        return MaterialPageRoute(
          builder: (_) => LandlordMainLayout(
            initialIndex: 1,
            child: const EmptyPlaceholderScreen(
              title: 'Properties',
              icon: Icons.apartment,
            ),
          ),
        );

      case AppRoutes.landlordPropertyDetails:
        final propertyId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => LandlordMainLayout(
            initialIndex: 1,
            child: EmptyPlaceholderScreen(
              title:
                  'Property Details${propertyId != null ? ' - $propertyId' : ''}',
              icon: Icons.apartment,
            ),
          ),
        );

      case AppRoutes.landlordCreateProperty:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Create Property',
            icon: Icons.add_location,
          ),
        );

      case AppRoutes.landlordEditProperty:
        final propertyId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title: 'Edit Property${propertyId != null ? ' - $propertyId' : ''}',
            icon: Icons.edit_location,
          ),
        );

      case AppRoutes.landlordPropertyDrafts:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Property Drafts',
            icon: Icons.drafts,
          ),
        );

      case AppRoutes.landlordPropertyAnalytics:
        final propertyId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title:
                'Property Analytics${propertyId != null ? ' - $propertyId' : ''}',
            icon: Icons.analytics,
          ),
        );

      case AppRoutes.landlordPropertyPerformance:
        final propertyId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title:
                'Property Performance${propertyId != null ? ' - $propertyId' : ''}',
            icon: Icons.trending_up,
          ),
        );

      // ── Applications Management ─────────────────────────
      case AppRoutes.landlordApplications:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Applications',
            icon: Icons.assignment,
          ),
        );

      case AppRoutes.landlordApplicationDetails:
        final applicationId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title:
                'Application Details${applicationId != null ? ' - $applicationId' : ''}',
            icon: Icons.assignment,
          ),
        );

      case AppRoutes.landlordApplicants:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Applicants List',
            icon: Icons.people,
          ),
        );

      case AppRoutes.landlordApplicantDetails:
        final applicantId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title:
                'Applicant Details${applicantId != null ? ' - $applicantId' : ''}',
            icon: Icons.person,
          ),
        );

      case AppRoutes.landlordApplicationStats:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Application Statistics',
            icon: Icons.bar_chart,
          ),
        );

      // ── Screening ───────────────────────────────────────
      case AppRoutes.landlordScreenings:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Screenings',
            icon: Icons.verified_user,
          ),
        );

      case AppRoutes.landlordScreeningDetails:
        final screeningId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title:
                'Screening Details${screeningId != null ? ' - $screeningId' : ''}',
            icon: Icons.verified_user,
          ),
        );

      case AppRoutes.landlordCreateScreening:
        final applicationId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title:
                'Create Screening${applicationId != null ? ' - $applicationId' : ''}',
            icon: Icons.add_task,
          ),
        );

      // ── Lease Management ────────────────────────────────
      case AppRoutes.landlordLeases:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Leases',
            icon: Icons.description,
          ),
        );

      case AppRoutes.landlordLeaseDetails:
        final leaseId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title: 'Lease Details${leaseId != null ? ' - $leaseId' : ''}',
            icon: Icons.description,
          ),
        );

      case AppRoutes.landlordCreateLease:
        final applicationId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title:
                'Create Lease${applicationId != null ? ' - $applicationId' : ''}',
            icon: Icons.note_add,
          ),
        );

      case AppRoutes.landlordSignLease:
        final leaseId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title: 'Sign Lease${leaseId != null ? ' - $leaseId' : ''}',
            icon: Icons.edit,
          ),
        );

      // ── Tenant Management ───────────────────────────────
      case AppRoutes.landlordTenants:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Tenants',
            icon: Icons.people,
          ),
        );

      case AppRoutes.landlordTenantDetails:
        final tenantId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title: 'Tenant Details${tenantId != null ? ' - $tenantId' : ''}',
            icon: Icons.person,
          ),
        );

      case AppRoutes.landlordTenantStats:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Tenant Statistics',
            icon: Icons.bar_chart,
          ),
        );

      // ── Financial Management ────────────────────────────
      case AppRoutes.landlordTransactions:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Transactions',
            icon: Icons.receipt,
          ),
        );

      case AppRoutes.landlordTransactionDetails:
        final transactionId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title:
                'Transaction Details${transactionId != null ? ' - $transactionId' : ''}',
            icon: Icons.receipt,
          ),
        );

      case AppRoutes.landlordTransactionStats:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Transaction Statistics',
            icon: Icons.bar_chart,
          ),
        );

      case AppRoutes.landlordFinancialOverview:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Financial Overview',
            icon: Icons.account_balance,
          ),
        );

      case AppRoutes.landlordRevenueChart:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Revenue Chart',
            icon: Icons.trending_up,
          ),
        );

      case AppRoutes.landlordOccupancyStats:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Occupancy Statistics',
            icon: Icons.pie_chart,
          ),
        );

      // ── Maintenance Management ──────────────────────────
      case AppRoutes.landlordMaintenance:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Maintenance Requests',
            icon: Icons.build,
          ),
        );

      case AppRoutes.landlordMaintenanceDetails:
        final maintenanceId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title:
                'Maintenance Details${maintenanceId != null ? ' - $maintenanceId' : ''}',
            icon: Icons.build,
          ),
        );

      case AppRoutes.landlordCreateMaintenance:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Create Maintenance Request',
            icon: Icons.add_box,
          ),
        );

      case AppRoutes.landlordMaintenanceStats:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Maintenance Statistics',
            icon: Icons.bar_chart,
          ),
        );

      // ── Inspections ─────────────────────────────────────
      case AppRoutes.landlordInspections:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Inspections',
            icon: Icons.checklist,
          ),
        );

      case AppRoutes.landlordInspectionDetails:
        final inspectionId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title:
                'Inspection Details${inspectionId != null ? ' - $inspectionId' : ''}',
            icon: Icons.checklist,
          ),
        );

      case AppRoutes.landlordScheduleInspection:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Schedule Inspection',
            icon: Icons.calendar_today,
          ),
        );

      case AppRoutes.landlordInspectionStats:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Inspection Statistics',
            icon: Icons.bar_chart,
          ),
        );

      // ── Reports ─────────────────────────────────────────
      case AppRoutes.landlordReports:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Reports',
            icon: Icons.file_present,
          ),
        );

      case AppRoutes.landlordReportDetails:
        final reportId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title: 'Report Details${reportId != null ? ' - $reportId' : ''}',
            icon: Icons.file_present,
          ),
        );

      case AppRoutes.landlordCreateReport:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Create Report',
            icon: Icons.note_add,
          ),
        );

      // ── Messaging ───────────────────────────────────────
      case AppRoutes.landlordMessages:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Messages',
            icon: Icons.message,
          ),
        );

      case AppRoutes.landlordChatDetails:
        final chatRoomId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title: 'Chat${chatRoomId != null ? ' - $chatRoomId' : ''}',
            icon: Icons.chat,
          ),
        );

      // ── Profile & Account ───────────────────────────────
      case AppRoutes.landlordProfile:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Profile',
            icon: Icons.person,
          ),
        );

      case AppRoutes.landlordEditProfile:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Edit Profile',
            icon: Icons.edit,
          ),
        );

      case AppRoutes.landlordUploadProfilePicture:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Upload Profile Picture',
            icon: Icons.photo_camera,
          ),
        );

      case AppRoutes.landlordUploadIdentityDocs:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Upload Identity Documents',
            icon: Icons.file_present,
          ),
        );

      case AppRoutes.landlordRequestVerification:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Request Verification',
            icon: Icons.verified,
          ),
        );

      case AppRoutes.landlordChangePassword:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Change Password',
            icon: Icons.lock,
          ),
        );

      case AppRoutes.landlordSettings:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Settings',
            icon: Icons.settings,
          ),
        );

      case AppRoutes.landlordPauseAccount:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Pause Account',
            icon: Icons.pause_circle,
          ),
        );

      case AppRoutes.landlordDeleteAccount:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Delete Account',
            icon: Icons.delete_forever,
          ),
        );

      default:
        return null;
    }
  }
}
