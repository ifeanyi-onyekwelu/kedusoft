import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/providers/auth_provider.dart';
import 'package:letsten/providers/tenant_provider.dart';
import 'package:letsten/widgets/greeting_app_bar.dart';

class TenantDashboardScreen extends StatefulWidget {
  const TenantDashboardScreen({super.key});

  @override
  State<TenantDashboardScreen> createState() => _TenantDashboardScreenState();
}

class _TenantDashboardScreenState extends State<TenantDashboardScreen> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    final tenantProvider = context.read<TenantProvider>();
    await Future.wait([
      tenantProvider.fetchApplications(),
      tenantProvider.fetchLikedProperties(),
      tenantProvider.fetchRecentActivities(),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        if (_selectedIndex != 0) {
          setState(() => _selectedIndex = 0);
          return false;
        }
        return true;
      },
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: Column(
          children: [
            GreetingAppBar(
              user: context.watch<AuthProvider>().user,
              onMenuPressed: () {
                final scaffoldState = context
                    .findAncestorStateOfType<ScaffoldState>();
                scaffoldState?.openDrawer();
              },
            ),
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Quick Stats
                      _buildQuickStats(),
                      const SizedBox(height: 32),
                      // Quick Actions
                      Text(
                        'Quick Actions',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      _buildQuickActions(),
                      const SizedBox(height: 32),
                      // Recent Activity
                      _buildRecentActivity(),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickStats() {
    return Consumer<TenantProvider>(
      builder: (context, tenantProvider, _) {
        final applicationCount = tenantProvider.applications.length;
        final viewedCount = tenantProvider.viewedPropertiesCount;
        final savedCount = tenantProvider.likedProperties.length;

        return Row(
          children: [
            Expanded(
              child: _buildStatCard(
                applicationCount.toString(),
                'Active Applications',
                Icons.assignment,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                viewedCount.toString(),
                'Properties Viewed',
                Icons.visibility,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                savedCount.toString(),
                'Saved Properties',
                Icons.favorite,
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildStatCard(String value, String label, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: AppColors.primary, size: 28),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: AppColors.grey600),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _buildActionCard(
            'Smart\nRecommendations',
            'Properties matched for you',
            Icons.stars_rounded,
            const Color(0xFFE3F2FD),
            AppColors.primary,
            () => Navigator.pushNamed(context, AppRoutes.tenantRecommendations),
          ),
          const SizedBox(width: 12),
          _buildActionCard(
            'Browse\nProperties',
            'Search available homes in your area',
            Icons.search,
            const Color(0xFFE8F5E9),
            const Color(0xFF4CAF50),
            () =>
                Navigator.pushNamed(context, AppRoutes.tenantBrowseProperties),
          ),
          const SizedBox(width: 12),
          _buildActionCard(
            'My\nApplications',
            'Track all your rental applications',
            Icons.folder_open,
            const Color(0xFFFFF3E0),
            const Color(0xFFFFA500),
            () => Navigator.pushNamed(context, AppRoutes.tenantApplications),
          ),
          const SizedBox(width: 12),
          _buildActionCard(
            'Messages',
            'Communicate with property owners',
            Icons.chat_bubble,
            const Color(0xFFF3E5F5),
            const Color(0xFF9C27B0),
            () => Navigator.pushNamed(context, AppRoutes.tenantMessages),
          ),
          const SizedBox(width: 12),
          _buildActionCard(
            'Payment\nCenter',
            'Manage rent and view payment history',
            Icons.payment,
            const Color(0xFFFCE4EC),
            const Color(0xFFE91E63),
            () => Navigator.pushNamed(context, AppRoutes.tenantPayments),
          ),
        ],
      ),
    );
  }

  Widget _buildActionCard(
    String title,
    String subtitle,
    IconData icon,
    Color bgColor,
    Color iconColor,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 160,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: iconColor, size: 24),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 11, color: AppColors.grey600),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8),
            Text(
              'Go to page',
              style: TextStyle(
                fontSize: 11,
                color: iconColor,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentActivity() {
    return Consumer<TenantProvider>(
      builder: (context, tenantProvider, _) {
        final activities = tenantProvider.recentActivities;

        if (activities.isEmpty) {
          return Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: [
                Align(
                  alignment: Alignment.topLeft,
                  child: Text(
                    'Recent Activity',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                Icon(Icons.history, size: 48, color: AppColors.grey400),
                const SizedBox(height: 16),
                Text(
                  'No recent activities',
                  style: Theme.of(
                    context,
                  ).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w500),
                ),
                const SizedBox(height: 8),
                Text(
                  'Start exploring properties to see your activity here',
                  style: Theme.of(
                    context,
                  ).textTheme.bodySmall?.copyWith(color: AppColors.grey600),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => Navigator.pushNamed(
                    context,
                    AppRoutes.tenantBrowseProperties,
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                  ),
                  child: const Text(
                    'Browse Properties',
                    style: TextStyle(color: AppColors.white),
                  ),
                ),
              ],
            ),
          );
        }

        return Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Recent Activity',
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: activities.length > 5 ? 5 : activities.length,
                separatorBuilder: (_, __) => const Divider(height: 24),
                itemBuilder: (context, index) {
                  final activity = activities[index];
                  return Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          Icons.check_circle,
                          color: AppColors.primary,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              activity['description'] ?? 'Activity',
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              activity['timestamp'] ?? '',
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.grey600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
