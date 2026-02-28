import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/models/property_model.dart';
import 'package:letsten/providers/tenant_provider.dart';
import 'package:letsten/widgets/empty_state_widget.dart';

class PropertyDetailsScreen extends StatefulWidget {
  final String propertyId;

  const PropertyDetailsScreen({Key? key, required this.propertyId})
    : super(key: key);

  @override
  State<PropertyDetailsScreen> createState() => _PropertyDetailsScreenState();
}

class _PropertyDetailsScreenState extends State<PropertyDetailsScreen> {
  late TenantProvider tenantProvider;
  int _currentPhotoIndex = 0;
  Property? property;

  @override
  void initState() {
    super.initState();
    tenantProvider = context.read<TenantProvider>();
    _loadPropertyDetails();
    // Track this property view
    tenantProvider.trackPropertyView(widget.propertyId);
  }

  Future<void> _loadPropertyDetails() async {
    // For now, we'll load from the recommendations/liked properties list
    // In production, you'd fetch from API
    final allProperties = [
      ...tenantProvider.recommendedProperties,
      ...tenantProvider.likedProperties,
    ];

    property = allProperties.firstWhere(
      (p) => p.id == widget.propertyId,
      orElse: () => Property(
        id: widget.propertyId,
        address: 'Loading...',
        city: '',
        area: '',
      ),
    );

    setState(() {});

    // Fetch fresh data from API if needed
    // await tenantProvider.getPropertyDetails(widget.propertyId);
  }

  String _formatPrice(double price) {
    if (price >= 1000000) {
      return '₦${(price / 1000000).toStringAsFixed(1)}M';
    } else if (price >= 1000) {
      return '₦${(price / 1000).toStringAsFixed(0)}K';
    }
    return '₦${price.toStringAsFixed(0)}';
  }

  String _formatSqft(double? sqft) {
    if (sqft == null) return 'N/A';
    return '${sqft.toStringAsFixed(0)} sqft';
  }

  @override
  Widget build(BuildContext context) {
    if (property == null) {
      return const Center(child: CircularProgressIndicator());
    }

    final galleries = property!.gallery ?? [];
    final coverImage = property!.coverImage;
    final images = [
      if (coverImage != null && coverImage.isNotEmpty) coverImage,
      ...galleries,
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // Image carousel with back button
          SliverAppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            pinned: false,
            expandedHeight: 300,
            flexibleSpace: FlexibleSpaceBar(
              background: _buildImageCarousel(images),
            ),
            leading: Container(
              margin: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
              ),
              child: IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.black),
                onPressed: () => Navigator.pop(context),
              ),
            ),
            actions: [
              Container(
                margin: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: IconButton(
                  icon: const Icon(Icons.share, color: Colors.black),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Sharing ${property!.displayName}'),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Photos indicator
                  if (images.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Text(
                        '${_currentPhotoIndex + 1} PHOTOS',
                        style: const TextStyle(
                          color: AppColors.primary,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),

                  // Title and price
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              property!.displayName,
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              property!.fullAddress,
                              style: const TextStyle(
                                fontSize: 14,
                                color: AppColors.grey600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            _formatPrice(property!.displayPrice),
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppColors.primary,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'per yearly',
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.grey600,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // View count
                  Row(
                    children: [
                      const Icon(
                        Icons.visibility,
                        size: 16,
                        color: AppColors.grey600,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '32 views',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.grey600,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Action buttons
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                  'Schedule Tour functionality coming soon',
                                ),
                              ),
                            );
                          },
                          icon: const Icon(Icons.calendar_today, size: 18),
                          label: const Text('Schedule Tour'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                  'Send Message functionality coming soon',
                                ),
                              ),
                            );
                          },
                          icon: const Icon(Icons.mail, size: 18),
                          label: const Text('Send Message'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppColors.primary,
                            side: const BorderSide(color: AppColors.primary),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Amenities
                  _buildAmenitiesGrid(),

                  const SizedBox(height: 24),

                  // About the property
                  _buildSection(
                    'About this property',
                    property!.description ?? 'No description available',
                  ),

                  const SizedBox(height: 24),

                  // Additional details
                  _buildAdditionalDetails(),

                  const SizedBox(height: 24),

                  // Amenities & Facilities
                  _buildAmenitiesFacilities(),

                  const SizedBox(height: 24),

                  // Location
                  _buildLocationSection(),

                  const SizedBox(height: 24),

                  // Property owner
                  _buildPropertyOwner(),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildImageCarousel(List<String> images) {
    if (images.isEmpty) {
      return Container(
        color: AppColors.grey300,
        child: const Center(
          child: Icon(Icons.image_not_supported, size: 48, color: Colors.grey),
        ),
      );
    }

    return Stack(
      children: [
        PageView.builder(
          onPageChanged: (index) {
            setState(() {
              _currentPhotoIndex = index;
            });
          },
          itemCount: images.length,
          itemBuilder: (context, index) {
            return Image.network(
              images[index],
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  color: AppColors.grey300,
                  child: const Icon(
                    Icons.broken_image,
                    size: 48,
                    color: Colors.grey,
                  ),
                );
              },
            );
          },
        ),
        Positioned(
          top: 16,
          right: 16,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.6),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              '${_currentPhotoIndex + 1}/${images.length}',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAmenitiesGrid() {
    final amenities = [
      {
        'icon': Icons.bed,
        'label': '${property!.bedrooms ?? 0}',
        'title': 'Bedroom${(property!.bedrooms ?? 0) != 1 ? 's' : ''}',
      },
      {
        'icon': Icons.bathtub,
        'label': '${property!.bathrooms ?? 0}',
        'title': 'Bathroom${(property!.bathrooms ?? 0) != 1 ? 's' : ''}',
      },
      {
        'icon': Icons.straighten,
        'label': _formatSqft(property!.sizeSqft),
        'title': 'Square Feet',
      },
      {
        'icon': Icons.local_parking,
        'label': '${property!.parkingSpaces ?? 0}',
        'title': 'Parking Spaces',
      },
      {
        'icon': Icons.kitchen,
        'label': '${property!.kitchens ?? 0}',
        'title': 'Kitchen${(property!.kitchens ?? 0) != 1 ? 's' : ''}',
      },
      {
        'icon': Icons.star,
        'label': property!.furnished == 'yes' ? 'Yes' : 'No',
        'title': 'Furnished',
      },
    ];

    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      childAspectRatio: 1,
      children: amenities
          .map(
            (amenity) => Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.grey300),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    amenity['icon'] as IconData,
                    size: 24,
                    color: AppColors.primary,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    amenity['label'].toString(),
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    amenity['title'].toString(),
                    style: const TextStyle(
                      fontSize: 10,
                      color: AppColors.grey600,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          )
          .toList(),
    );
  }

  Widget _buildSection(String title, String content) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        Text(
          content,
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.grey600,
            height: 1.6,
          ),
        ),
      ],
    );
  }

  Widget _buildAdditionalDetails() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F5F5),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Additional Details',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          _buildDetailRow('Available From', 'December 27, 2025'),
          const SizedBox(height: 12),
          _buildDetailRow(
            'Water Source',
            property!.waterSourceStr ?? 'borehole',
          ),
          const SizedBox(height: 12),
          _buildDetailRow('Year Built', '${property!.yearBuilt ?? 2023}'),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 14, color: AppColors.grey600),
        ),
        Text(
          value,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        ),
      ],
    );
  }

  Widget _buildAmenitiesFacilities() {
    final amenities = property!.securityFeatures ?? [];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Amenities & Facilities',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        if (amenities.isEmpty)
          const Padding(
            padding: EdgeInsets.all(16),
            child: Text(
              'No amenities listed for this property',
              style: TextStyle(color: AppColors.grey600),
            ),
          )
        else
          Column(
            children: amenities
                .map(
                  (amenity) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.check_circle,
                          size: 20,
                          color: AppColors.primary,
                        ),
                        const SizedBox(width: 12),
                        Text(amenity, style: const TextStyle(fontSize: 14)),
                      ],
                    ),
                  ),
                )
                .toList(),
          ),
      ],
    );
  }

  Widget _buildLocationSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Location',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        Container(
          height: 200,
          decoration: BoxDecoration(
            color: AppColors.grey300,
            borderRadius: BorderRadius.circular(8),
          ),
          child: const Center(
            child: Icon(Icons.map, size: 48, color: Colors.grey),
          ),
        ),
        const SizedBox(height: 12),
        Text(
          property!.fullAddress,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        ),
      ],
    );
  }

  Widget _buildPropertyOwner() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Property Owner',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: AppColors.grey300),
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: const Icon(
                  Icons.person,
                  color: AppColors.primary,
                  size: 28,
                ),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Property Manager',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      '+234 XXX XXXX XXX',
                      style: TextStyle(fontSize: 12, color: AppColors.grey600),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.phone, color: AppColors.primary),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Call functionality coming soon'),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ],
    );
  }
}
