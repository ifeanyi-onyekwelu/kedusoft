import 'package:flutter/material.dart';
import 'package:letsten/router/auth_routes.dart';
import 'package:letsten/router/public_routes.dart';
import 'package:letsten/router/tenant_routes.dart';
import 'package:letsten/router/landlord_routes.dart';

class NotFoundScreen extends StatelessWidget {
  const NotFoundScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: Text('Route not found')));
  }
}

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    // Try Auth Routes
    final authRoute = AuthRoutes.generate(settings);
    if (authRoute != null) return authRoute;

    // Try Public Routes
    final publicRoute = PublicRoutes.generate(settings);
    if (publicRoute != null) return publicRoute;

    // Try Tenant Routes
    final tenantRoute = TenantRoutes.generate(settings);
    if (tenantRoute != null) return tenantRoute;

    // Try Landlord Routes
    final landlordRoute = LandlordRoutes.generate(settings);
    if (landlordRoute != null) return landlordRoute;

    // Fallback to Not Found
    return MaterialPageRoute(builder: (_) => const NotFoundScreen());
  }
}
