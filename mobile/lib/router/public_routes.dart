import 'package:flutter/material.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/screens/public/property_details_screen.dart';
import 'package:letsten/screens/empty_placeholder_screen.dart';

class PublicRoutes {
  static Route<dynamic>? generate(RouteSettings settings) {
    switch (settings.name) {
      // ── Home & Browsing ─────────────────────────────────
      case AppRoutes.home:
        return MaterialPageRoute(
          builder: (_) =>
              const EmptyPlaceholderScreen(title: 'Home', icon: Icons.home),
        );

      case AppRoutes.browseProperties:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Browse Properties',
            icon: Icons.search,
          ),
        );

      case AppRoutes.searchResults:
        final query = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => EmptyPlaceholderScreen(
            title: 'Search Results${query != null ? ' - $query' : ''}',
            icon: Icons.search,
          ),
        );

      case AppRoutes.propertyDetails:
        final propertyId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => PropertyDetailsScreen(propertyId: propertyId),
        );

      case AppRoutes.propertyMapView:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Property Map View',
            icon: Icons.map,
          ),
        );

      case AppRoutes.propertyComparison:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Property Comparison',
            icon: Icons.compare,
          ),
        );

      case AppRoutes.featuredProperties:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Featured Properties',
            icon: Icons.star,
          ),
        );

      case AppRoutes.latestProperties:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Latest Properties',
            icon: Icons.new_releases,
          ),
        );

      case AppRoutes.recommendedProperties:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Recommended Properties',
            icon: Icons.recommend,
          ),
        );

      case AppRoutes.shortletsPage:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Shortlets',
            icon: Icons.calendar_today,
          ),
        );

      // ── Educational Content ─────────────────────────────
      case AppRoutes.howItWorks:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'How It Works',
            icon: Icons.info,
          ),
        );

      case AppRoutes.tenantGuide:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Tenant Guide',
            icon: Icons.menu_book,
          ),
        );

      case AppRoutes.howToApply:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'How to Apply',
            icon: Icons.help_outline,
          ),
        );

      case AppRoutes.agentPage:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Our Team',
            icon: Icons.people,
          ),
        );

      case AppRoutes.propertyManagementInfo:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Property Management',
            icon: Icons.domain,
          ),
        );

      // ── Resources & Information ─────────────────────────
      case AppRoutes.blog:
        return MaterialPageRoute(
          builder: (_) =>
              const EmptyPlaceholderScreen(title: 'Blog', icon: Icons.article),
        );

      case AppRoutes.marketInsights:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Market Insights',
            icon: Icons.trending_up,
          ),
        );

      case AppRoutes.mortgageCalculator:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Mortgage Calculator',
            icon: Icons.calculate,
          ),
        );

      case AppRoutes.faqs:
        return MaterialPageRoute(
          builder: (_) =>
              const EmptyPlaceholderScreen(title: 'FAQs', icon: Icons.help),
        );

      case AppRoutes.contactUs:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Contact Us',
            icon: Icons.phone,
          ),
        );

      case AppRoutes.aboutUs:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'About Us',
            icon: Icons.business_center,
          ),
        );

      // ── Legal & Policies ────────────────────────────────
      case AppRoutes.privacyPolicy:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Privacy Policy',
            icon: Icons.privacy_tip,
          ),
        );

      case AppRoutes.termsOfService:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Terms of Service',
            icon: Icons.description,
          ),
        );

      case AppRoutes.fairHousing:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Fair Housing',
            icon: Icons.gavel,
          ),
        );

      case AppRoutes.cookiePolicy:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Cookie Policy',
            icon: Icons.policy,
          ),
        );

      case AppRoutes.resourcesHub:
        return MaterialPageRoute(
          builder: (_) => const EmptyPlaceholderScreen(
            title: 'Resources',
            icon: Icons.library_books,
          ),
        );

      default:
        return null;
    }
  }
}
