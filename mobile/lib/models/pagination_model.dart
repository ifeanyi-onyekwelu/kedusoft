import 'package:json_annotation/json_annotation.dart';

part 'pagination_model.g.dart';

@JsonSerializable()
class Pagination {
  final int page;
  final int pages;
  @JsonKey(name: 'per_page')
  final int perPage;
  final int total;

  Pagination({
    required this.page,
    required this.pages,
    required this.perPage,
    required this.total,
  });

  factory Pagination.fromJson(Map<String, dynamic> json) =>
      _$PaginationFromJson(json);

  Map<String, dynamic> toJson() => _$PaginationToJson(this);
}
