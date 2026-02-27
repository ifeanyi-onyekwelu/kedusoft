import 'package:flutter/material.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/widgets/empty_state_widget.dart';

class TenantNotificationsScreen extends StatefulWidget {
  const TenantNotificationsScreen({super.key});

  @override
  State<TenantNotificationsScreen> createState() =>
      _TenantNotificationsScreenState();
}

class _TenantNotificationsScreenState extends State<TenantNotificationsScreen> {
  bool hasNotifications = true;

  final notifications = [
    {
      'id': '1',
      'type': 'application',
      'title': 'Application Status Updated',
      'message':
          'Your application for Ikeja GRA Office Complex has been approved!',
      'time': 'about 1 hour ago',
      'read': false,
    },
    {
      'id': '2',
      'type': 'payment',
      'title': 'Rent Payment Due',
      'message':
          'Your rent payment is due in 3 days. ₦2,000,000 due on Feb 27, 2026',
      'time': '1 day ago',
      'read': false,
    },
    {
      'id': '3',
      'type': 'verification',
      'title': 'Account Verified',
      'message':
          'Congratulations! Your account has been verified successfully.',
      'time': '2 days ago',
      'read': true,
    },
    {
      'id': '4',
      'type': 'message',
      'title': 'New Message from Landlord',
      'message': 'Chinedu Landlord sent you a message about lease signing',
      'time': '3 days ago',
      'read': true,
    },
    {
      'id': '5',
      'type': 'screening',
      'title': 'Screening Required',
      'message':
          'Please complete your background screening for Ikoyi Luxury Studio',
      'time': '1 week ago',
      'read': true,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 1,
        title: Text(
          'Notifications',
          style: Theme.of(
            context,
          ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        actions: [
          TextButton(
            onPressed: () {
              // Mark all as read
            },
            child: const Text('Mark all read'),
          ),
        ],
      ),
      body: hasNotifications
          ? _buildNotificationsList(context)
          : EmptyStateWidget(
              icon: Icons.notifications_off_outlined,
              title: 'No Notifications',
              description:
                  'You\'re all caught up! Check back later for updates on your applications and messages from landlords.',
            ),
    );
  }

  Widget _buildNotificationsList(BuildContext context) {
    return ListView.builder(
      itemCount: notifications.length,
      itemBuilder: (context, index) {
        final notif = notifications[index];
        return GestureDetector(
          onTap: () {
            // Handle notification tap
          },
          child: Container(
            decoration: BoxDecoration(
              color: notif['read'] as bool
                  ? AppColors.white
                  : const Color(0xFFEBF4FF),
              border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Icon
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: _getNotificationColor(
                        notif['type'] as String,
                      ).withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      _getNotificationIcon(notif['type'] as String),
                      color: _getNotificationColor(notif['type'] as String),
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 16),
                  // Content
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                notif['title'] as String,
                                style: Theme.of(context).textTheme.bodyLarge
                                    ?.copyWith(
                                      fontWeight: notif['read'] as bool
                                          ? FontWeight.normal
                                          : FontWeight.bold,
                                    ),
                              ),
                            ),
                            if (!(notif['read'] as bool))
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: AppColors.primary,
                                  shape: BoxShape.circle,
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          notif['message'] as String,
                          style: Theme.of(context).textTheme.bodySmall
                              ?.copyWith(color: AppColors.grey600),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          notif['time'] as String,
                          style: Theme.of(context).textTheme.bodySmall
                              ?.copyWith(color: AppColors.grey600),
                        ),
                      ],
                    ),
                  ),
                  // Menu
                  PopupMenuButton(
                    itemBuilder: (context) => [
                      const PopupMenuItem(child: Text('Delete')),
                      const PopupMenuItem(child: Text('Archive')),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  IconData _getNotificationIcon(String type) {
    switch (type) {
      case 'application':
        return Icons.assignment_outlined;
      case 'payment':
        return Icons.payment_outlined;
      case 'verification':
        return Icons.verified_outlined;
      case 'message':
        return Icons.message_outlined;
      case 'screening':
        return Icons.fact_check_outlined;
      default:
        return Icons.notifications_outlined;
    }
  }

  Color _getNotificationColor(String type) {
    switch (type) {
      case 'application':
        return Colors.green;
      case 'payment':
        return Colors.orange;
      case 'verification':
        return Colors.blue;
      case 'message':
        return AppColors.primary;
      case 'screening':
        return Colors.purple;
      default:
        return AppColors.grey600;
    }
  }
}
