import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/providers/tenant_provider.dart';
import 'package:letsten/utils/formatting_utils.dart';
import 'package:letsten/widgets/shared_widgets.dart' hide EmptyStateWidget;
import 'package:letsten/widgets/empty_state_widget.dart';

class RecommendationsScreen extends StatefulWidget {
  const RecommendationsScreen({super.key});

  @override
  State<RecommendationsScreen> createState() => _RecommendationsScreenState();
}

class _RecommendationsScreenState extends State<RecommendationsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TenantProvider>().fetchRecommendedProperties();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 1,
        title: const Text('Smart Recommendations'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              context.read<TenantProvider>().fetchRecommendedProperties();
            },
          ),
          PopupMenuButton(
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'preferences',
                child: Text('Update Preferences'),
              ),
            ],
            onSelected: (value) {
              if (value == 'preferences') {
                _showPreferencesDialog(context);
              }
            },
          ),
        ],
      ),
      body: Consumer<TenantProvider>(
        builder: (context, tenantProvider, child) {
          if (tenantProvider.recommendedPropertiesLoading) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.primary),
            );
          }

          final recommendations = tenantProvider.recommendedProperties;

          if (recommendations.isEmpty) {
            return EmptyStateWidget(
              icon: Icons.star_outline,
              iconColor: AppColors.primary,
              title: 'No Recommendations Yet',
              description:
                  'Browse properties to get personalized recommendations based on your preferences.',
              action: ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).pop();
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

          return ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: recommendations.length,
            itemBuilder: (context, index) {
              final property = recommendations[index];
              final isLiked = tenantProvider.isPropertyLiked(property.id);

              return PropertyCardWidget(
                propertyId: property.id,
                title: property.displayName,
                location: property.address,
                price: FormattingUtils.formatPrice(property.displayPrice),
                bedrooms: property.bedrooms ?? 0,
                bathrooms: property.bathrooms ?? 0,
                squareFeet: FormattingUtils.formatSqft(property.sizeSqft),
                imageUrl: (property.gallery?.isNotEmpty ?? false)
                    ? property.gallery![0]
                    : property.coverImage ?? '',
                matchPercentage: '${(index + 1) * 10}%',
                isLiked: isLiked,
                isLoading: false,
                onLikePressed: () async {
                  try {
                    await tenantProvider.toggleLikeProperty(property.id);
                  } catch (e) {
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Error: $e'),
                          backgroundColor: Colors.red,
                        ),
                      );
                    }
                  }
                },
                onSharePressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Sharing ${property.displayName} is in progress',
                      ),
                    ),
                  );
                },
                onViewPressed: () {
                  Navigator.pushNamed(
                    context,
                    AppRoutes.tenantPropertyDetails,
                    arguments: property.id,
                  );
                },
              );
            },
          );
        },
      ),
    );
  }

  void _showPreferencesDialog(BuildContext context) {
    showDialog(context: context, builder: (context) => _PreferencesDialog());
  }
}

class _PreferencesDialog extends StatefulWidget {
  @override
  State<_PreferencesDialog> createState() => _PreferencesDialogState();
}

class _PreferencesDialogState extends State<_PreferencesDialog> {
  String _propertyType = 'All';
  String _bedrooms = 'Any';
  String _priceRange = 'Any';
  bool _furnished = false;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Update Preferences'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 12),
            const Text(
              'Property Type',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            const SizedBox(height: 8),
            DropdownButton<String>(
              value: _propertyType,
              isExpanded: true,
              items: ['All', 'Rent', 'Sell', 'Shortlet']
                  .map(
                    (value) =>
                        DropdownMenuItem(value: value, child: Text(value)),
                  )
                  .toList(),
              onChanged: (value) {
                setState(() => _propertyType = value ?? 'All');
              },
            ),
            const SizedBox(height: 20),
            const Text(
              'Number of Bedrooms',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            const SizedBox(height: 8),
            DropdownButton<String>(
              value: _bedrooms,
              isExpanded: true,
              items: ['Any', '1', '2', '3', '4', '5+']
                  .map(
                    (value) =>
                        DropdownMenuItem(value: value, child: Text(value)),
                  )
                  .toList(),
              onChanged: (value) {
                setState(() => _bedrooms = value ?? 'Any');
              },
            ),
            const SizedBox(height: 20),
            const Text(
              'Price Range',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            const SizedBox(height: 8),
            DropdownButton<String>(
              value: _priceRange,
              isExpanded: true,
              items:
                  [
                        'Any',
                        '₦0 - ₦500K',
                        '₦500K - ₦1M',
                        '₦1M - ₦5M',
                        '₦5M - ₦10M',
                        '₦10M+',
                      ]
                      .map(
                        (value) =>
                            DropdownMenuItem(value: value, child: Text(value)),
                      )
                      .toList(),
              onChanged: (value) {
                setState(() => _priceRange = value ?? 'Any');
              },
            ),
            const SizedBox(height: 20),
            CheckboxListTile(
              title: const Text('Furnished Properties'),
              value: _furnished,
              onChanged: (value) {
                setState(() => _furnished = value ?? false);
              },
              contentPadding: EdgeInsets.zero,
              controlAffinity: ListTileControlAffinity.leading,
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () {
            // Save preferences and fetch recommendations
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text(
                  'Preferences updated! Fetching new recommendations...',
                ),
              ),
            );
            Navigator.pop(context);
            context.read<TenantProvider>().fetchRecommendedProperties();
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
          ),
          child: const Text('Save'),
        ),
      ],
    );
  }
}
