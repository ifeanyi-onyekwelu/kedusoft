import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/providers/tenant_provider.dart';
import 'package:letsten/utils/formatting_utils.dart';
import 'package:letsten/widgets/empty_state_widget.dart';
import 'package:letsten/widgets/shared_widgets.dart' hide EmptyStateWidget;

class SavedPropertiesScreen extends StatefulWidget {
  const SavedPropertiesScreen({super.key});

  @override
  State<SavedPropertiesScreen> createState() => _SavedPropertiesScreenState();
}

class _SavedPropertiesScreenState extends State<SavedPropertiesScreen> {
  int _currentPage = 1;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TenantProvider>().fetchLikedProperties(page: 1, perPage: 10);
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
            itemCount:
                tenantProvider.likedProperties.length +
                (tenantProvider.likedPropertiesPagination?.page !=
                        tenantProvider.likedPropertiesPagination?.pages
                    ? 1
                    : 0),
            itemBuilder: (context, index) {
              // Load more button at the end
              if (index == tenantProvider.likedProperties.length) {
                return Padding(
                  padding: const EdgeInsets.all(16),
                  child: ElevatedButton.icon(
                    onPressed: tenantProvider.likedPropertiesLoading
                        ? null
                        : () => tenantProvider.loadMoreLikedProperties(),
                    icon: tenantProvider.likedPropertiesLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                AppColors.white,
                              ),
                            ),
                          )
                        : const Icon(Icons.download),
                    label: Text(
                      tenantProvider.likedPropertiesLoading
                          ? 'Loading...'
                          : 'Load More',
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: AppColors.white,
                      minimumSize: const Size(double.infinity, 50),
                    ),
                  ),
                );
              }

              final property = tenantProvider.likedProperties[index];

              return PropertyCardWidget(
                propertyId: property.id,
                title: property.displayName,
                location: property.fullAddress,
                price: FormattingUtils.formatPrice(property.displayPrice),
                bedrooms: property.bedrooms ?? 0,
                bathrooms: property.bathrooms ?? 0,
                squareFeet: FormattingUtils.formatSqft(property.sizeSqft),
                imageUrl: (property.gallery?.isNotEmpty ?? false)
                    ? property.gallery!.first
                    : property.coverImage ?? '',
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
}
