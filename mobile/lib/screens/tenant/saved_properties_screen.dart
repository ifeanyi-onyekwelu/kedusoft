import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/providers/tenant_provider.dart';
import 'package:letsten/widgets/empty_state_widget.dart';
import 'package:letsten/widgets/shared_widgets.dart' hide EmptyStateWidget;

class SavedPropertiesScreen extends StatefulWidget {
  const SavedPropertiesScreen({super.key});

  @override
  State<SavedPropertiesScreen> createState() => _SavedPropertiesScreenState();
}

class _SavedPropertiesScreenState extends State<SavedPropertiesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TenantProvider>().fetchLikedProperties();
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
          'Saved Properties',
          style: Theme.of(
            context,
          ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppColors.primary),
            onPressed: () {
              context.read<TenantProvider>().fetchLikedProperties();
            },
          ),
        ],
      ),
      body: Consumer<TenantProvider>(
        builder: (context, tenantProvider, _) {
          if (tenantProvider.likedPropertiesLoading) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.primary),
            );
          }

          if (tenantProvider.likedProperties.isEmpty) {
            return EmptyStateWidget(
              icon: Icons.bookmark_outline,
              iconColor: AppColors.primary,
              title: 'No Saved Properties',
              description:
                  'Properties you save will appear here. Start saving your favorite properties to keep track of them easily.',
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
            itemCount: tenantProvider.likedProperties.length,
            itemBuilder: (context, index) {
              final property = tenantProvider.likedProperties[index];

              return PropertyCardWidget(
                propertyId: property.id,
                title: property.name,
                location: property.fullAddress,
                price: '₦${property.rentAmount.toStringAsFixed(0)}',
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                squareFeet: property.area,
                imageUrl: property.gallery.isNotEmpty
                    ? property.gallery.first
                    : '',
                matchPercentage: null,
                isLiked: true,
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
                  // Navigate to property details if needed
                },
              );
            },
          );
        },
      ),
    );
  }
}
