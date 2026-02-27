import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/models/user_model.dart';
import 'package:letsten/providers/auth_provider.dart';

class TenantMainLayout extends StatefulWidget {
  final int initialIndex;
  final Widget child;

  const TenantMainLayout({
    super.key,
    required this.child,
    this.initialIndex = 0,
  });

  @override
  State<TenantMainLayout> createState() => _TenantMainLayoutState();
}

class _TenantMainLayoutState extends State<TenantMainLayout> {
  late int _selectedIndex;

  @override
  void initState() {
    super.initState();
    _selectedIndex = widget.initialIndex;
  }

  void _logout() async {
    final authProvider = context.read<AuthProvider>();
    await authProvider.logout();
    if (mounted) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.login);
    }
  }

  String _getUserDisplayName(User? user) {
    if (user == null) return 'Guest User';

    // Try firstName and lastName first
    if (user.firstName != null && user.firstName!.isNotEmpty) {
      if (user.lastName != null && user.lastName!.isNotEmpty) {
        return '${user.firstName} ${user.lastName}';
      }
      return user.firstName!;
    }

    // Fallback to email
    if (user.email.isNotEmpty) {
      final emailName = user.email.split('@')[0];
      return emailName;
    }

    return 'User';
  }

  String _getUserInitials(User? user) {
    if (user == null) return 'GU';

    String firstName = user.firstName ?? '';
    String lastName = user.lastName ?? '';

    if (firstName.isNotEmpty && lastName.isNotEmpty) {
      return '${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}';
    } else if (firstName.isNotEmpty) {
      return firstName.substring(0, 1).toUpperCase();
    } else if (user.email.isNotEmpty) {
      return user.email.substring(0, 1).toUpperCase();
    }

    return 'U';
  }

  Drawer _buildDrawer(User? user) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(color: AppColors.primary),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: Colors.white,
                  backgroundImage:
                      user?.profilePicture != null &&
                          user!.profilePicture!.isNotEmpty
                      ? NetworkImage(user.profilePicture!)
                      : null,
                  child:
                      user?.profilePicture == null ||
                          user!.profilePicture!.isEmpty
                      ? Text(
                          '${user?.firstName != null ? user?.firstName![0] : 'G'}${user?.lastName != null ? user?.lastName![0] : 'U'}',
                          style: Theme.of(context).textTheme.titleMedium
                              ?.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.bold,
                              ),
                        )
                      : null,
                ),
                const SizedBox(height: 12),
                Text(
                  user?.firstName != null
                      ? '${user?.firstName} ${user?.lastName}'
                      : 'Guest User',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Unverified Tenant',
                  style: Theme.of(
                    context,
                  ).textTheme.bodySmall?.copyWith(color: Colors.white70),
                ),
              ],
            ),
          ),
          _buildDrawerItem(
            icon: Icons.home_outlined,
            title: 'Dashboard',
            onTap: () => Navigator.pop(context),
          ),
          _buildDrawerItem(
            icon: Icons.star_outline,
            title: 'Recommendations',
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, AppRoutes.tenantRecommendations);
            },
          ),
          _buildDrawerItem(
            icon: Icons.search_outlined,
            title: 'Browse Properties',
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, AppRoutes.browseProperties);
            },
          ),
          _buildDrawerItem(
            icon: Icons.assignment_outlined,
            title: 'My Applications',
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, AppRoutes.tenantApplications);
            },
          ),
          _buildDrawerItem(
            icon: Icons.favorite_outline,
            title: 'Saved Properties',
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, AppRoutes.tenantFavorites);
            },
          ),
          _buildDrawerItem(
            icon: Icons.message_outlined,
            title: 'Messages',
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, AppRoutes.tenantMessages);
            },
          ),
          _buildDrawerItem(
            icon: Icons.payment_outlined,
            title: 'Transactions',
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, AppRoutes.tenantTransactions);
            },
          ),
          _buildDrawerItem(
            icon: Icons.receipt_outlined,
            title: 'Screenings',
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, AppRoutes.tenantScreenings);
            },
          ),
          _buildDrawerItem(
            icon: Icons.file_present_outlined,
            title: 'Leases',
            onTap: () {},
          ),
          const Divider(),
          _buildDrawerItem(
            icon: Icons.settings_outlined,
            title: 'Settings',
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, AppRoutes.tenantSettings);
            },
          ),
          _buildDrawerItem(
            icon: Icons.help_outline,
            title: 'Help & Support',
            onTap: () {},
          ),
          _buildDrawerItem(
            icon: Icons.logout_outlined,
            title: 'Logout',
            onTap: () {
              Navigator.pop(context);
              _logout();
            },
            isRed: true,
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    bool isRed = false,
  }) {
    return ListTile(
      leading: Icon(icon, color: isRed ? Colors.red : AppColors.grey600),
      title: Text(
        title,
        style: TextStyle(
          color: isRed ? Colors.red : Colors.black,
          fontWeight: FontWeight.w500,
        ),
      ),
      onTap: onTap,
    );
  }

  BottomNavigationBar _buildBottomNavigationBar() {
    return BottomNavigationBar(
      currentIndex: _selectedIndex,
      backgroundColor: AppColors.white,
      selectedItemColor: AppColors.primary,
      unselectedItemColor: AppColors.grey600,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
      onTap: (index) {
        if (index == _selectedIndex) return;
        setState(() => _selectedIndex = index);
        switch (index) {
          case 0:
            Navigator.pushReplacementNamed(context, AppRoutes.tenantDashboard);
            break;
          case 1:
            Navigator.pushReplacementNamed(context, AppRoutes.tenantBrowseProperties);
            break;
          case 2:
            Navigator.pushReplacementNamed(
              context,
              AppRoutes.tenantApplications,
            );
            break;
          case 3:
            Navigator.pushReplacementNamed(context, AppRoutes.tenantFavorites);
            break;
          case 4:
            Navigator.pushReplacementNamed(context, AppRoutes.tenantMessages);
            break;
        }
      },
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home_outlined),
          activeIcon: Icon(Icons.home_filled),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.search_outlined),
          activeIcon: Icon(Icons.search),
          label: 'Browse',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.assignment_outlined),
          activeIcon: Icon(Icons.assignment),
          label: 'Applications',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.favorite_outline),
          activeIcon: Icon(Icons.favorite),
          label: 'Favorites',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.message_outlined),
          activeIcon: Icon(Icons.message),
          label: 'Messages',
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;

    return WillPopScope(
      onWillPop: () async {
        if (_selectedIndex != 0) {
          setState(() => _selectedIndex = 0);
          Navigator.pushReplacementNamed(context, AppRoutes.tenantDashboard);
          return false;
        }
        return true;
      },
      child: Scaffold(
        backgroundColor: AppColors.background,
        drawer: _buildDrawer(user),
        body: widget.child,
        bottomNavigationBar: _buildBottomNavigationBar(),
      ),
    );
  }
}
