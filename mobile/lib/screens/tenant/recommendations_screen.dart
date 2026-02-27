import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/providers/tenant_provider.dart';
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
                child: Text('Update Preferences'),
                value: 'preferences',
              ),
            ],
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
                title: property.name,
                location: property.address,
                price: '₦${property.rentAmount.toStringAsFixed(0)}',
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                squareFeet: property.area,
                imageUrl: property.gallery.isNotEmpty
                    ? property.gallery[0]
                    : '',
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
                      content: Text('Sharing ${property.name} is in progress'),
                    ),
                  );
                },
                onViewPressed: () {
                  // Navigate to property details
                },
              );
            },
          );
        },
      ),
    );
  }
}
