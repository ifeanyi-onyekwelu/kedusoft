import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/providers/tenant_provider.dart';
import 'package:letsten/providers/property_provider.dart';

class BrowsePropertiesScreen extends StatefulWidget {
  const BrowsePropertiesScreen({super.key});

  @override
  State<BrowsePropertiesScreen> createState() => _BrowsePropertiesScreenState();
}

class _BrowsePropertiesScreenState extends State<BrowsePropertiesScreen> {
  int _selectedIndex = 1; // Browse is index 1
  bool _isMapView = false;
  String _selectedType = 'Rent';
  String _selectedCategory = 'All';
  String _selectedBeds = 'Any';
  RangeValues _priceRange = const RangeValues(0, 10000000);
  int _currentPage = 1;

  final TextEditingController _searchController = TextEditingController();

  final List<String> _propertyTypes = ['Rent', 'Buy', 'Shortlet'];
  final List<String> _categories = [
    'All',
    'Residential',
    'Commercial',
    'Duplex',
    'Apartment',
    'Office',
  ];
  final List<String> _bedOptions = ['Any', '1', '2', '3', '4', '5+'];

  @override
  void initState() {
    super.initState();
    // Fetch initial properties with default filters
    Future.microtask(() {
      _fetchFilteredProperties();
    });
  }

  // Mock data
  final List<Map<String, dynamic>> _properties = [
    {
      'id': '1',
      'title': 'Ikoyi Luxury Studio',
      'location': 'Ikoyi, Lagos',
      'price': 4000000,
      'bedrooms': 1,
      'bathrooms': 1,
      'sqft': 1919,
      'status': 'Available',
      'tags': ['borehole'],
      'available': 'Dec 27',
      'image':
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
      'isLiked': false,
    },
    {
      'id': '2',
      'title': 'Ikeja GRA Office Complex',
      'location': 'Ikeja, Lagos',
      'price': 12000000,
      'bedrooms': 0,
      'bathrooms': 1,
      'sqft': 3177,
      'status': 'Available',
      'tags': ['borehole'],
      'available': 'Dec 27',
      'image':
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=80',
      'isLiked': true,
    },
    {
      'id': '3',
      'title': 'Asokoro Executive Duplex',
      'location': 'Asokoro, Abuja',
      'price': 15000000,
      'bedrooms': 5,
      'bathrooms': 5,
      'sqft': 1855,
      'status': 'Available',
      'tags': ['borehole'],
      'available': 'Dec 27',
      'image':
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80',
      'isLiked': false,
    },
    {
      'id': '4',
      'title': 'Gwarinpa Family Bungalow',
      'location': 'Gwarinpa, Abuja',
      'price': 3500000,
      'bedrooms': 4,
      'bathrooms': 4,
      'sqft': 2699,
      'status': 'Available',
      'tags': ['borehole'],
      'available': 'Dec 27',
      'image':
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80',
      'isLiked': false,
    },
    {
      'id': '5',
      'title': 'New Haven 3-Bed Flat',
      'location': 'Chime Avenue, Enugu',
      'price': 2000000,
      'bedrooms': 3,
      'bathrooms': 3,
      'sqft': 1857,
      'status': 'Available',
      'tags': ['24hr electricity'],
      'available': 'Jan 1',
      'image':
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
      'isLiked': false,
    },
    {
      'id': '6',
      'title': 'GRA Smart Apartment',
      'location': 'Polo Park View, Enugu',
      'price': 3000000,
      'bedrooms': 2,
      'bathrooms': 2,
      'sqft': 1400,
      'status': 'Available',
      'tags': ['security', 'borehole'],
      'available': 'Jan 15',
      'image':
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80',
      'isLiked': false,
    },
  ];

  String _formatPrice(double price) {
    if (price >= 1000000) {
      return '₦${(price / 1000000).toStringAsFixed(1)}M';
    } else if (price >= 1000) {
      return '₦${(price / 1000).toStringAsFixed(0)}K';
    }
    return '₦${price.toStringAsFixed(0)}';
  }

  void _onBottomNavTap(int index) {
    if (index == _selectedIndex) return;
    switch (index) {
      case 0:
        Navigator.pushReplacementNamed(context, AppRoutes.tenantDashboard);
        break;
      case 1:
        break; // Already here
      case 2:
        Navigator.pushReplacementNamed(context, AppRoutes.tenantApplications);
        break;
      case 3:
        Navigator.pushReplacementNamed(context, AppRoutes.tenantFavorites);
        break;
      case 4:
        Navigator.pushReplacementNamed(context, AppRoutes.tenantMessages);
        break;
    }
  }

  void _fetchFilteredProperties() {
    final propertyProvider =
        Provider.of<PropertyProvider>(context, listen: false);

    // Convert selected beds to int
    final bedroomCount =
        _selectedBeds == 'Any' ? null : int.tryParse(_selectedBeds);

    // Convert price range values
    final minPrice =
        _priceRange.start > 0 ? _priceRange.start : null;
    final maxPrice =
        _priceRange.end < 10000000 ? _priceRange.end : null;

    // Map listing type: 'Rent' -> 'rent', 'Buy' -> 'sale', 'Shortlet' -> 'shortlet'
    final listingTypeMap = {
      'Rent': 'rent',
      'Buy': 'sale',
      'Shortlet': 'shortlet',
    };
    final listingType = listingTypeMap[_selectedType];

    // Map category: 'All' -> null, others as-is but lowercase
    final category = _selectedCategory == 'All'
        ? null
        : _selectedCategory.toLowerCase();

    // Fetch properties with filters (resets to page 1)
    propertyProvider.fetchBrowsePropertiesWithFilters(
      page: 1,
      perPage: 10,
      city: _searchController.text.isNotEmpty
          ? _searchController.text
          : null,
      listingType: listingType,
      category: category,
      bedrooms: bedroomCount,
      minPrice: minPrice,
      maxPrice: maxPrice,
    );
  }

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => _FilterSheet(
        selectedType: _selectedType,
        selectedCategory: _selectedCategory,
        selectedBeds: _selectedBeds,
        priceRange: _priceRange,
        propertyTypes: _propertyTypes,
        categories: _categories,
        bedOptions: _bedOptions,
        onApply: (type, category, beds, price) {
          setState(() {
            _selectedType = type;
            _selectedCategory = category;
            _selectedBeds = beds;
            _priceRange = price;
            _currentPage = 1; // Reset to first page on filter change
          });
          Navigator.pop(context);
          _fetchFilteredProperties(); // Call API with new filters
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: _buildAppBar(),
      body: Column(
        children: [
          _buildFilterRow(),
          _buildResultsHeader(),
          Expanded(
            child: _isMapView ? _buildMapPlaceholder() : _buildPropertyList(),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      automaticallyImplyLeading: false,
      backgroundColor: AppColors.white,
      elevation: 1,
      title: Container(
        height: 42,
        decoration: BoxDecoration(
          color: AppColors.grey100,
          borderRadius: BorderRadius.circular(10),
        ),
        child: TextField(
          controller: _searchController,
          decoration: InputDecoration(
            hintText: 'City, area, or location...',
            hintStyle: const TextStyle(color: AppColors.grey400, fontSize: 14),
            prefixIcon: const Icon(
              Icons.search,
              color: AppColors.grey400,
              size: 20,
            ),
            suffixIcon: _searchController.text.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear, size: 18),
                    onPressed: () {
                      _searchController.clear();
                      setState(() {});
                    },
                  )
                : null,
            border: InputBorder.none,
            enabledBorder: InputBorder.none,
            focusedBorder: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(vertical: 10),
            filled: false,
          ),
          onChanged: (v) => setState(() {}),
        ),
      ),
      actions: [
        // Map / List toggle
        Container(
          margin: const EdgeInsets.only(right: 12),
          decoration: BoxDecoration(
            color: AppColors.grey100,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              _buildViewToggleBtn(
                icon: Icons.list,
                isActive: !_isMapView,
                onTap: () => setState(() => _isMapView = false),
              ),
              _buildViewToggleBtn(
                icon: Icons.map_outlined,
                isActive: _isMapView,
                onTap: () => setState(() => _isMapView = true),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildViewToggleBtn({
    required IconData icon,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isActive ? AppColors.primary : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(
          icon,
          size: 18,
          color: isActive ? AppColors.white : AppColors.grey500,
        ),
      ),
    );
  }

  Widget _buildFilterRow() {
    return Container(
      color: AppColors.white,
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: [
            // Filter icon button
            GestureDetector(
              onTap: _showFilterSheet,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.grey300),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: const [
                    Icon(Icons.tune, size: 16, color: AppColors.grey700),
                    SizedBox(width: 4),
                    Text(
                      'Filters',
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.grey700,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 8),
            // Type chips
            ..._propertyTypes.map(
              (type) => Padding(
                padding: const EdgeInsets.only(right: 8),
                child: _buildFilterChip(
                  label: type,
                  isSelected: _selectedType == type,
                  onTap: () {
                    setState(() {
                      _selectedType = type;
                      _currentPage = 1;
                    });
                    _fetchFilteredProperties();
                  },
                ),
              ),
            ),
            // Price chip
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: _buildFilterChip(
                label: 'Price',
                isSelected: false,
                onTap: _showFilterSheet,
                trailing: Icons.keyboard_arrow_down,
              ),
            ),
            // Bed chip
            _buildFilterChip(
              label: _selectedBeds == 'Any' ? 'Beds' : '$_selectedBeds Bed',
              isSelected: _selectedBeds != 'Any',
              onTap: _showFilterSheet,
              trailing: Icons.keyboard_arrow_down,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip({
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
    IconData? trailing,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.transparent,
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.grey300,
          ),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                color: isSelected ? AppColors.white : AppColors.grey700,
                fontWeight: FontWeight.w500,
              ),
            ),
            if (trailing != null) ...[
              const SizedBox(width: 2),
              Icon(
                trailing,
                size: 16,
                color: isSelected ? AppColors.white : AppColors.grey500,
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildResultsHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          Text(
            '${_properties.length} properties found',
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.grey600,
              fontWeight: FontWeight.w500,
            ),
          ),
          const Spacer(),
          GestureDetector(
            onTap: () {},
            child: Row(
              children: const [
                Text(
                  'Sort',
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.primary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Icon(Icons.sort, size: 16, color: AppColors.primary),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPropertyList() {
    return Consumer2<PropertyProvider, TenantProvider>(
      builder: (context, propertyProvider, tenantProvider, _) {
        // Use browse properties from provider (paginated)
        final properties = propertyProvider.browseProperties;
        final pagination = propertyProvider.browsePropertiesPagination;

        if (properties.isEmpty && propertyProvider.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (properties.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.home_outlined, size: 64, color: AppColors.grey400),
                const SizedBox(height: 16),
                Text(
                  'No properties found',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                Text(
                  'Try adjusting your filters',
                  style: Theme.of(
                    context,
                  ).textTheme.bodySmall?.copyWith(color: AppColors.grey600),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          itemCount: properties.length +
              (pagination?.page != pagination?.pages ? 1 : 0),
          itemBuilder: (context, index) {
            // Load more button at the end
            if (index == properties.length) {
              return Padding(
                padding: const EdgeInsets.all(16),
                child: ElevatedButton.icon(
                  onPressed: propertyProvider.isLoading
                      ? null
                      : () {
                          propertyProvider.loadMoreBrowseProperties(
                            city: _searchController.text.isNotEmpty
                                ? _searchController.text
                                : null,
                            listingType: {
                              'Rent': 'rent',
                              'Buy': 'sale',
                              'Shortlet': 'shortlet',
                            }[_selectedType],
                            category: _selectedCategory == 'All'
                                ? null
                                : _selectedCategory.toLowerCase(),
                            bedrooms: _selectedBeds == 'Any'
                                ? null
                                : int.tryParse(_selectedBeds),
                            minPrice: _priceRange.start > 0
                                ? _priceRange.start
                                : null,
                            maxPrice: _priceRange.end < 10000000
                                ? _priceRange.end
                                : null,
                          );
                        },
                  icon: propertyProvider.isLoading
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
                  label: Text(propertyProvider.isLoading
                      ? 'Loading...'
                      : 'Load More'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: AppColors.white,
                    minimumSize: const Size(double.infinity, 50),
                  ),
                );
              }
            }

            final property = properties[index];

            return _PropertyCard(
              property: {
                'id': property.id,
                'title': property.displayName,
                'location': property.fullAddress,
                'price': (property.displayPrice).toInt(),
                'bedrooms': property.bedrooms ?? 0,
                'bathrooms': property.bathrooms ?? 0,
                'sqft': property.area,
                'image': (property.gallery?.isNotEmpty ?? false)
                    ? property.gallery!.first
                    : (property.coverImage ?? ''),
                'status': 'Available',
                'tags': [],
                'available': 'Dec 27',
                'isLiked': tenantProvider.isPropertyLiked(property.id),
              },
              formatPrice: _formatPrice,
              onLikeTap: () async {
                // Toggle like status with provider
                final result = await tenantProvider.toggleLikeProperty(
                  property.id,
                );

                // Show feedback
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        result
                            ? 'Added to favorites'
                            : 'Removed from favorites',
                      ),
                      duration: const Duration(seconds: 1),
                      backgroundColor: result ? Colors.green : Colors.orange,
                    ),
                  );
                }
              },
              onTap: () {
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
    );
  }

  Widget _buildMapPlaceholder() {
    return Container(
      color: AppColors.grey100,
      child: Stack(
        children: [
          // Map placeholder
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.map, size: 64, color: AppColors.grey300),
                SizedBox(height: 12),
                Text(
                  'Map View',
                  style: TextStyle(color: AppColors.grey400, fontSize: 16),
                ),
                SizedBox(height: 4),
                Text(
                  'Integrate Google Maps here',
                  style: TextStyle(color: AppColors.grey400, fontSize: 12),
                ),
              ],
            ),
          ),
          // Price pins overlay (decorative)
          Positioned(top: 120, left: 60, child: _buildMapPin('₦12M')),
          Positioned(
            top: 200,
            right: 80,
            child: _buildMapPin('₦4M', isActive: true),
          ),
          Positioned(bottom: 200, left: 120, child: _buildMapPin('₦2.5M')),
          Positioned(bottom: 160, right: 40, child: _buildMapPin('₦45M')),
          // Bottom sheet mini card
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 36,
                    height: 4,
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: AppColors.grey300,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  Text(
                    'Showing ${_properties.length} properties',
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 130,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _properties.length,
                      itemBuilder: (context, index) =>
                          _buildMapMiniCard(_properties[index]),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMapPin(String price, {bool isActive = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: isActive ? AppColors.primary : AppColors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Text(
        price,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: isActive ? AppColors.white : AppColors.grey900,
        ),
      ),
    );
  }

  Widget _buildMapMiniCard(Map<String, dynamic> property) {
    return Container(
      width: 180,
      margin: const EdgeInsets.only(right: 12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.grey200),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.horizontal(
              left: Radius.circular(10),
            ),
            child: Image.network(
              property['image'],
              width: 65,
              height: 130,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                width: 65,
                color: AppColors.grey200,
                child: const Icon(Icons.home, color: AppColors.grey400),
              ),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    property['title'],
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '₦${(property['price'] as int).toStringAsFixed(0)}/yr',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  BottomNavigationBar _buildBottomNav() {
    return BottomNavigationBar(
      currentIndex: _selectedIndex,
      backgroundColor: AppColors.white,
      selectedItemColor: AppColors.primary,
      unselectedItemColor: AppColors.grey600,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
      onTap: _onBottomNavTap,
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
          label: 'Apps',
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
}

// ─── Property Card ───────────────────────────────────────────────────────────

class _PropertyCard extends StatelessWidget {
  final Map<String, dynamic> property;
  final String Function(double) formatPrice;
  final VoidCallback onLikeTap;
  final VoidCallback onTap;

  const _PropertyCard({
    required this.property,
    required this.formatPrice,
    required this.onLikeTap,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image section
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(12),
                  ),
                  child: Image.network(
                    property['image'],
                    height: 190,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      height: 190,
                      color: AppColors.grey200,
                      child: const Center(
                        child: Icon(
                          Icons.home,
                          size: 48,
                          color: AppColors.grey400,
                        ),
                      ),
                    ),
                  ),
                ),
                // Available badge
                Positioned(
                  top: 10,
                  left: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.success,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      property['status'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                // Price overlay
                Positioned(
                  bottom: 10,
                  left: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '₦${_formatFullPrice(property['price'])}/yr',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                // Like button
                Positioned(
                  top: 10,
                  right: 10,
                  child: GestureDetector(
                    onTap: onLikeTap,
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                      child: Icon(
                        property['isLiked']
                            ? Icons.favorite
                            : Icons.favorite_border,
                        size: 18,
                        color: property['isLiked']
                            ? Colors.red
                            : AppColors.grey500,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            // Content section
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    property['title'],
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.grey900,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  // Location
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on_outlined,
                        size: 14,
                        color: AppColors.grey500,
                      ),
                      const SizedBox(width: 3),
                      Expanded(
                        child: Text(
                          property['location'],
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.grey500,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  // Stats row
                  Row(
                    children: [
                      _buildStat(
                        Icons.bed_outlined,
                        '${property['bedrooms']} bed',
                      ),
                      const SizedBox(width: 14),
                      _buildStat(
                        Icons.bathtub_outlined,
                        '${property['bathrooms']} bath',
                      ),
                      const SizedBox(width: 14),
                      _buildStat(Icons.square_foot, '${property['sqft']} sqft'),
                    ],
                  ),
                  const SizedBox(height: 10),
                  // Tags
                  if ((property['tags'] as List).isNotEmpty)
                    Wrap(
                      spacing: 6,
                      children: (property['tags'] as List<String>)
                          .map(
                            (tag) => Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 3,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.grey100,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                tag,
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: AppColors.grey600,
                                ),
                              ),
                            ),
                          )
                          .toList(),
                    ),
                  const SizedBox(height: 10),
                  // Bottom row
                  Row(
                    children: [
                      const CircleAvatar(
                        radius: 12,
                        backgroundColor: AppColors.grey200,
                        child: Text(
                          'L',
                          style: TextStyle(
                            fontSize: 10,
                            color: AppColors.grey600,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Text(
                        'Landlord',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.grey500,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        'Available ${property['available']}',
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.grey500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatFullPrice(int price) {
    if (price >= 1000000) {
      final millions = price / 1000000;
      return millions == millions.roundToDouble()
          ? '${millions.toInt()},000,000'
          : '${price.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')}';
    }
    return price.toString().replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (m) => '${m[1]},',
    );
  }

  Widget _buildStat(IconData icon, String label) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppColors.grey500),
        const SizedBox(width: 3),
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: AppColors.grey600),
        ),
      ],
    );
  }
}

// ─── Filter Bottom Sheet ──────────────────────────────────────────────────────

class _FilterSheet extends StatefulWidget {
  final String selectedType;
  final String selectedCategory;
  final String selectedBeds;
  final RangeValues priceRange;
  final List<String> propertyTypes;
  final List<String> categories;
  final List<String> bedOptions;
  final Function(String, String, String, RangeValues) onApply;

  const _FilterSheet({
    required this.selectedType,
    required this.selectedCategory,
    required this.selectedBeds,
    required this.priceRange,
    required this.propertyTypes,
    required this.categories,
    required this.bedOptions,
    required this.onApply,
  });

  @override
  State<_FilterSheet> createState() => _FilterSheetState();
}

class _FilterSheetState extends State<_FilterSheet> {
  late String _type;
  late String _category;
  late String _beds;
  late RangeValues _price;

  @override
  void initState() {
    super.initState();
    _type = widget.selectedType;
    _category = widget.selectedCategory;
    _beds = widget.selectedBeds;
    _price = widget.priceRange;
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.75,
      maxChildSize: 0.95,
      minChildSize: 0.5,
      expand: false,
      builder: (_, controller) => Container(
        decoration: const BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          children: [
            // Handle
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(top: 12, bottom: 16),
              decoration: BoxDecoration(
                color: AppColors.grey300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  const Text(
                    'Filters',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const Spacer(),
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _type = 'Rent';
                        _category = 'All';
                        _beds = 'Any';
                        _price = const RangeValues(0, 10000000);
                      });
                    },
                    child: const Text('Reset'),
                  ),
                ],
              ),
            ),
            const Divider(),
            Expanded(
              child: ListView(
                controller: controller,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  // Property Type
                  _buildSectionTitle('Property Type'),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    children: widget.propertyTypes
                        .map(
                          (t) => _buildSelectChip(
                            label: t,
                            isSelected: _type == t,
                            onTap: () => setState(() => _type = t),
                          ),
                        )
                        .toList(),
                  ),
                  const SizedBox(height: 20),
                  // Category
                  _buildSectionTitle('Category'),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: widget.categories
                        .map(
                          (c) => _buildSelectChip(
                            label: c,
                            isSelected: _category == c,
                            onTap: () => setState(() => _category = c),
                          ),
                        )
                        .toList(),
                  ),
                  const SizedBox(height: 20),
                  // Bedrooms
                  _buildSectionTitle('Bedrooms'),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    children: widget.bedOptions
                        .map(
                          (b) => _buildSelectChip(
                            label: b,
                            isSelected: _beds == b,
                            onTap: () => setState(() => _beds = b),
                          ),
                        )
                        .toList(),
                  ),
                  const SizedBox(height: 20),
                  // Price Range
                  _buildSectionTitle('Price Range (per year)'),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '₦${(_price.start / 1000000).toStringAsFixed(1)}M',
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppColors.grey600,
                        ),
                      ),
                      Text(
                        '₦${(_price.end / 1000000).toStringAsFixed(1)}M',
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppColors.grey600,
                        ),
                      ),
                    ],
                  ),
                  RangeSlider(
                    values: _price,
                    min: 0,
                    max: 50000000,
                    divisions: 50,
                    activeColor: AppColors.primary,
                    inactiveColor: AppColors.grey200,
                    onChanged: (v) => setState(() => _price = v),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
            // Apply button
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () =>
                      widget.onApply(_type, _category, _beds, _price),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: const Text(
                    'Apply Filters',
                    style: TextStyle(
                      color: AppColors.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.grey800,
      ),
    );
  }

  Widget _buildSelectChip({
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.transparent,
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.grey300,
          ),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: isSelected ? AppColors.white : AppColors.grey700,
          ),
        ),
      ),
    );
  }
}
