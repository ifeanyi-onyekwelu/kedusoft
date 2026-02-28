import 'package:json_annotation/json_annotation.dart';
import 'property_model.dart';
import 'pagination_model.dart';

part 'paginated_properties_response.g.dart';

@JsonSerializable()
class PaginatedPropertiesResponse {
  final Pagination pagination;
  final List<Property> properties;

  PaginatedPropertiesResponse({
    required this.pagination,
    required this.properties,
  });

  factory PaginatedPropertiesResponse.fromJson(Map<String, dynamic> json) {
    print(
      'PaginatedPropertiesResponse.fromJson - Received JSON keys: ${json.keys.toList()}',
    );
    try {
      // Extract pagination and properties manually for better error handling
      final paginationData = json['pagination'];
      final propertiesData = json['properties'];

      if (paginationData == null || propertiesData == null) {
        throw Exception('Missing pagination or properties data');
      }

      // Parse pagination
      final pagination = Pagination.fromJson(paginationData);

      // Parse properties with resilience - skip failed ones instead of failing completely
      final List<Property> properties = [];
      if (propertiesData is List) {
        for (int i = 0; i < propertiesData.length; i++) {
          try {
            final propertyJson = propertiesData[i];
            if (propertyJson is Map<String, dynamic>) {
              final property = Property.fromJson(propertyJson);
              properties.add(property);
            }
          } catch (e) {
            print(
              'PaginatedPropertiesResponse: Skipped property at index $i due to error: $e',
            );
            // Continue with next property instead of failing completely
          }
        }
      }

      print(
        'PaginatedPropertiesResponse - Parsed successfully. Properties count: ${properties.length}',
      );
      return PaginatedPropertiesResponse(
        pagination: pagination,
        properties: properties,
      );
    } catch (e) {
      print('PaginatedPropertiesResponse.fromJson - Error parsing: $e');
      print(
        'PaginatedPropertiesResponse.fromJson - Stack trace: ${StackTrace.current}',
      );
      rethrow;
    }
  }

  Map<String, dynamic> toJson() => _$PaginatedPropertiesResponseToJson(this);
}
