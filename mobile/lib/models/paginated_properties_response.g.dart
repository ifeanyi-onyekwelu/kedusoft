// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'paginated_properties_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PaginatedPropertiesResponse _$PaginatedPropertiesResponseFromJson(
        Map<String, dynamic> json) =>
    PaginatedPropertiesResponse(
      pagination:
          Pagination.fromJson(json['pagination'] as Map<String, dynamic>),
      properties: (json['properties'] as List<dynamic>)
          .map((e) => Property.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$PaginatedPropertiesResponseToJson(
        PaginatedPropertiesResponse instance) =>
    <String, dynamic>{
      'pagination': instance.pagination,
      'properties': instance.properties,
    };
