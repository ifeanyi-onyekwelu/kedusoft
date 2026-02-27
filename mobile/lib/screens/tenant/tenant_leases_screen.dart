import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/providers/tenant_provider.dart';
import 'package:letsten/widgets/empty_state_widget.dart';

class TenantLeasesScreen extends StatefulWidget {
  const TenantLeasesScreen({super.key});

  @override
  State<TenantLeasesScreen> createState() => _TenantLeasesScreenState();
}

class _TenantLeasesScreenState extends State<TenantLeasesScreen> {
  String _selectedTab = 'active';

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      context.read<TenantProvider>().fetchAllLeases();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 1,
        title: Text(
          'Leases',
          style: Theme.of(
            context,
          ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppColors.primary),
            onPressed: () {
              context.read<TenantProvider>().fetchAllLeases();
            },
          ),
        ],
      ),
      body: Consumer<TenantProvider>(
        builder: (context, tenantProvider, _) {
          if (tenantProvider.leasesLoading) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.primary),
            );
          }

          if (tenantProvider.leasesError != null &&
              tenantProvider.leases.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 64, color: Colors.red),
                  const SizedBox(height: 20),
                  Text(
                    'Failed to load leases',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    tenantProvider.leasesError ?? '',
                    style: Theme.of(context).textTheme.bodySmall,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: () {
                      context.read<TenantProvider>().fetchAllLeases();
                    },
                    icon: const Icon(Icons.refresh),
                    label: const Text('Retry'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ],
              ),
            );
          }

          if (tenantProvider.leases.isEmpty) {
            return EmptyStateWidget(
              icon: Icons.file_present_outlined,
              iconColor: const Color(0xFF2196F3),
              title: 'No Leases Yet',
              description:
                  'Once your application is approved and you sign a lease agreement, it will appear here. You\'ll be able to view, download, and manage all your lease documents.',
              action: ElevatedButton.icon(
                onPressed: () {
                  Navigator.pushNamed(
                    context,
                    AppRoutes.tenantBrowseProperties,
                  );
                },
                icon: const Icon(Icons.search),
                label: const Text('Browse Properties'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: AppColors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
            );
          }

          return Column(
            children: [
              // Tab selector
              Container(
                color: AppColors.white,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Expanded(child: _buildTabButton('active', 'Active')),
                      const SizedBox(width: 8),
                      Expanded(child: _buildTabButton('all', 'All Leases')),
                    ],
                  ),
                ),
              ),

              // Leases list
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: tenantProvider.leases.length,
                  itemBuilder: (context, index) {
                    final lease = tenantProvider.leases[index];
                    return _buildLeaseCard(context, lease);
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildTabButton(String tab, String label) {
    final isSelected = _selectedTab == tab;
    return GestureDetector(
      onTap: () {
        setState(() => _selectedTab = tab);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: isSelected ? AppColors.primary : Colors.transparent,
              width: 3,
            ),
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: isSelected ? AppColors.primary : Colors.grey,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLeaseCard(BuildContext context, lease) {
    // Determine status from lease object
    String statusText = 'Active';
    Color statusColor = Colors.green;
    IconData statusIcon = Icons.check_circle;

    // Try to determine status from dates
    if (lease.endDate != null) {
      try {
        final endDate = lease.endDate is DateTime
            ? lease.endDate
            : DateTime.parse(lease.endDate.toString());
        if (endDate.isBefore(DateTime.now())) {
          statusText = 'Expired';
          statusColor = Colors.grey;
          statusIcon = Icons.error;
        }
      } catch (e) {
        // Keep defaults
      }
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with status
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      lease.propertyTitle ??
                          lease.propertyAddress ??
                          'Lease Agreement',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    if (lease.landlordName != null)
                      Text(
                        'by ${lease.landlordName}',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.grey600,
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: statusColor.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Icon(statusIcon, size: 16, color: statusColor),
                    const SizedBox(width: 6),
                    Text(
                      statusText,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: statusColor,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Details Grid
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildLeaseDetail(
                  'Rent Amount',
                  _formatAmount(lease.rentAmount),
                ),
                Container(width: 1, height: 40, color: Colors.grey[300]),
                _buildLeaseDetail('Start Date', _formatDate(lease.startDate)),
                Container(width: 1, height: 40, color: Colors.grey[300]),
                _buildLeaseDetail('End Date', _formatDate(lease.endDate)),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Status banner
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: statusColor.withOpacity(0.3)),
            ),
            child: Text(
              statusText == 'Active'
                  ? '${_calculateDaysRemaining(lease.endDate)} days remaining'
                  : 'This lease has expired',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: statusColor,
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Action buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    _showLeaseDetails(context, lease);
                  },
                  icon: const Icon(Icons.description_outlined),
                  label: const Text('View Details'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    side: const BorderSide(color: AppColors.primary),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              if (statusText == 'Active' &&
                  lease.status?.toLowerCase() != 'signed')
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      _showSignLeaseDialog(context, lease);
                    },
                    icon: const Icon(Icons.edit_document),
                    label: const Text('Sign Lease'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: AppColors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLeaseDetail(String label, String value) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            color: Colors.grey,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          value,
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  void _showLeaseDetails(BuildContext context, lease) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Lease Details',
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            _buildDetailRow('Property', lease.propertyTitle ?? 'N/A'),
            _buildDetailRow('Landlord', lease.landlordName ?? 'N/A'),
            _buildDetailRow('Rent Amount', _formatAmount(lease.rentAmount)),
            _buildDetailRow('Start Date', _formatDate(lease.startDate)),
            _buildDetailRow('End Date', _formatDate(lease.endDate)),
            _buildDetailRow('Status', lease.status ?? 'N/A'),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text('Close'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showSignLeaseDialog(BuildContext context, lease) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sign Lease?'),
        content: const Text(
          'By signing this lease, you agree to all the terms and conditions. Make sure you have read and understood the lease agreement.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(context);
              // In a real app, you would handle signature collection
              context.read<TenantProvider>().signLease(lease.id!, 'signed');
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Lease signed successfully!'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            style: FilledButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('Sign'),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: Colors.grey,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  String _formatDate(dynamic date) {
    if (date == null) return 'N/A';
    try {
      final dateTime = date is DateTime
          ? date
          : DateTime.parse(date.toString());
      return '${dateTime.day} ${_getMonthName(dateTime.month)} ${dateTime.year}';
    } catch (e) {
      return 'N/A';
    }
  }

  String _getMonthName(int month) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[month - 1];
  }

  String _formatAmount(dynamic amount) {
    if (amount == null) return '₦0.00';
    try {
      final num = double.parse(amount.toString());
      return '₦${num.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}';
    } catch (e) {
      return '₦0.00';
    }
  }

  int _calculateDaysRemaining(dynamic endDate) {
    if (endDate == null) return 0;
    try {
      final dateTime = endDate is DateTime
          ? endDate
          : DateTime.parse(endDate.toString());
      return dateTime.difference(DateTime.now()).inDays;
    } catch (e) {
      return 0;
    }
  }
}
