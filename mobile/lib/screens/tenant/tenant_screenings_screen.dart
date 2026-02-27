import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/providers/tenant_provider.dart';
import 'package:letsten/widgets/empty_state_widget.dart';

class TenantScreeningsScreen extends StatefulWidget {
  const TenantScreeningsScreen({super.key});

  @override
  State<TenantScreeningsScreen> createState() => _TenantScreeningsScreenState();
}

class _TenantScreeningsScreenState extends State<TenantScreeningsScreen> {
  String _selectedStatus = 'all';

  @override
  void initState() {
    super.initState();
    // Fetch screenings from API
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TenantProvider>().fetchScreenings();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 1,
        title: Text(
          'Screenings',
          style: Theme.of(
            context,
          ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        actions: [
          TextButton.icon(
            onPressed: () {
              context.read<TenantProvider>().fetchScreenings();
            },
            icon: const Icon(Icons.refresh, color: AppColors.primary),
            label: const Text('Refresh'),
            style: TextButton.styleFrom(foregroundColor: AppColors.primary),
          ),
        ],
      ),
      body: Consumer<TenantProvider>(
        builder: (context, tenantProvider, _) {
          if (tenantProvider.screeningsLoading) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.primary),
            );
          }

          if (tenantProvider.screenings.isEmpty) {
            return EmptyStateWidget(
              icon: Icons.verified_outlined,
              iconColor: AppColors.primary,
              title: 'No Screenings Yet',
              description:
                  'When you apply for properties, your screenings will appear here. Landlords may request additional information to complete the screening process.',
              action: ElevatedButton.icon(
                onPressed: () {},
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

          return _buildScreeningsList(context, tenantProvider.screenings);
        },
      ),
    );
  }

  Widget _buildScreeningsList(BuildContext context, List screenings) {
    // Filter screenings based on selected status
    List filteredScreenings = screenings.where((scr) {
      if (_selectedStatus == 'all') return true;
      return scr.status?.toLowerCase() == _selectedStatus;
    }).toList();

    return SingleChildScrollView(
      child: Column(
        children: [
          // Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  _buildFilterChip('All', 'all'),
                  _buildFilterChip('Pending', 'pending'),
                  _buildFilterChip('Approved', 'approved'),
                  _buildFilterChip('Rejected', 'rejected'),
                ],
              ),
            ),
          ),
          // Screenings List
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: filteredScreenings.length,
            itemBuilder: (context, index) {
              final scr = filteredScreenings[index];
              return GestureDetector(
                onTap: () {
                  // Navigate to screening details
                },
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey[200]!),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  scr.propertyTitle ?? 'Property',
                                  style: Theme.of(context).textTheme.bodyLarge
                                      ?.copyWith(fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(
                                      Icons.location_on_outlined,
                                      size: 14,
                                      color: AppColors.grey600,
                                    ),
                                    const SizedBox(width: 4),
                                    Expanded(
                                      child: Text(
                                        scr.propertyAddress ??
                                            'Location not specified',
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodySmall
                                            ?.copyWith(
                                              color: AppColors.grey600,
                                            ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          _buildStatusBadge(scr.status ?? 'pending'),
                        ],
                      ),
                      const SizedBox(height: 12),
                      // Screening types (if available)
                      if (scr.screeningTypes != null &&
                          scr.screeningTypes!.isNotEmpty)
                        Wrap(
                          spacing: 8,
                          children: scr.screeningTypes!.map((type) {
                            return Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.blue[50],
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: Colors.blue[200]!),
                              ),
                              child: Text(
                                type,
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      if (scr.screeningTypes != null &&
                          scr.screeningTypes!.isNotEmpty)
                        const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Submitted: ${_formatDate(scr.createdAt)}',
                            style: Theme.of(context).textTheme.bodySmall
                                ?.copyWith(color: AppColors.grey600),
                          ),
                          TextButton(
                            onPressed: () {
                              // Show details
                            },
                            child: const Text('View Details'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    final isSelected = _selectedStatus == value;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (_) {
          setState(() => _selectedStatus = value);
        },
        backgroundColor: Colors.grey[100],
        selectedColor: AppColors.primary,
        labelStyle: TextStyle(
          color: isSelected ? AppColors.white : AppColors.black,
          fontWeight: FontWeight.w500,
        ),
        side: BorderSide(
          color: isSelected ? AppColors.primary : Colors.grey[300]!,
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    final Map<String, Map<String, dynamic>> statusConfig = {
      'pending': {
        'label': 'Pending',
        'color': Colors.orange,
        'icon': Icons.schedule,
      },
      'approved': {
        'label': 'Approved',
        'color': Colors.green,
        'icon': Icons.check_circle,
      },
      'rejected': {
        'label': 'Rejected',
        'color': Colors.red,
        'icon': Icons.cancel,
      },
    };

    final config = statusConfig[status] ?? statusConfig['pending']!;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: (config['color'] as Color).withOpacity(0.1),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: (config['color'] as Color).withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            config['icon'] as IconData,
            size: 14,
            color: config['color'] as Color,
          ),
          const SizedBox(width: 4),
          Text(
            config['label'] as String,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: config['color'] as Color,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime? date) {
    if (date == null) return 'N/A';
    return '${date.day} ${_monthName(date.month)} ${date.year}';
  }

  String _monthName(int month) {
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
}
