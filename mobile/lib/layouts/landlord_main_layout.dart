import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/models/user_model.dart';
import 'package:letsten/providers/auth_provider.dart';

class LandlordMainLayout extends StatefulWidget {
  final int initialIndex;
  final Widget child;

  const LandlordMainLayout({
    super.key,
    required this.child,
    this.initialIndex = 0,
  });

  @override
  State<LandlordMainLayout> createState() => _LandlordMainLayoutState();
}

class _LandlordMainLayoutState extends State<LandlordMainLayout> {
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

  PreferredSizeWidget _buildCustomAppBar(User? user) {
    return AppBar(
      backgroundColor: AppColors.white,
      elevation: 0,
      iconTheme: const IconThemeData(color: AppColors.black),
      title: Text(
        'Letsten',
        style: Theme.of(context).textTheme.titleLarge?.copyWith(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: AppColors.primary,
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined),
          onPressed: () {
            Navigator.pushReplacementNamed(context, AppRoutes.landlordAlerts);
          },
        ),
        IconButton(
          icon: const Icon(Icons.message_outlined),
          onPressed: () {
            Navigator.pushReplacementNamed(context, AppRoutes.landlordMessages);
          },
        ),
      ],
    );
  }

  Drawer _buildDrawer(User? user) {
    return Drawer(
      child: SafeArea(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            UserAccountsDrawerHeader(
              accountName: Text(
                user?.firstName ?? 'User',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              accountEmail: Text(user?.email ?? ''),
              currentAccountPicture: CircleAvatar(
                backgroundColor: AppColors.primary,
                child: Text(
                  (user?.firstName ?? 'U')[0].toUpperCase(),
                  style: const TextStyle(
                    fontSize: 24,
                    color: AppColors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              decoration: const BoxDecoration(color: AppColors.primary),
            ),
            ListTile(
              leading: const Icon(Icons.person),
              title: const Text('Profile'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushReplacementNamed(
                  context,
                  AppRoutes.landlordProfile,
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.settings),
              title: const Text('Settings'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushReplacementNamed(
                  context,
                  AppRoutes.landlordSettings,
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.history),
              title: const Text('Recent Activity'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushReplacementNamed(
                  context,
                  AppRoutes.landlordRecentActivity,
                );
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout, color: Colors.red),
              title: const Text('Logout', style: TextStyle(color: Colors.red)),
              onTap: _logout,
            ),
          ],
        ),
      ),
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
            Navigator.pushReplacementNamed(
              context,
              AppRoutes.landlordDashboard,
            );
            break;
          case 1:
            Navigator.pushReplacementNamed(
              context,
              AppRoutes.landlordProperties,
            );
            break;
          case 2:
            Navigator.pushReplacementNamed(
              context,
              AppRoutes.landlordApplications,
            );
            break;
          case 3:
            Navigator.pushReplacementNamed(
              context,
              AppRoutes.landlordTransactions,
            );
            break;
          case 4:
            Navigator.pushReplacementNamed(context, AppRoutes.landlordMessages);
            break;
        }
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
        BottomNavigationBarItem(
          icon: Icon(Icons.apartment),
          label: 'Properties',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.assignment),
          label: 'Applications',
        ),
        BottomNavigationBarItem(icon: Icon(Icons.receipt), label: 'Finances'),
        BottomNavigationBarItem(icon: Icon(Icons.message), label: 'Messages'),
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
          Navigator.pushReplacementNamed(context, AppRoutes.landlordDashboard);
          return false;
        }
        return true;
      },
      child: Scaffold(
        backgroundColor: AppColors.background,
        appBar: _buildCustomAppBar(user),
        drawer: _buildDrawer(user),
        body: widget.child,
        bottomNavigationBar: _buildBottomNavigationBar(),
      ),
    );
  }
}
