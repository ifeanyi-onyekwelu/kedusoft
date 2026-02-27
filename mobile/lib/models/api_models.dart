// API Request/Response Models

import 'package:letsten/models/user_model.dart';

class LoginRequest {
  final String email;
  final String password;

  LoginRequest({required this.email, required this.password});

  Map<String, dynamic> toJson() => {'email': email, 'password': password};
}

class SignupRequest {
  final String firstName;
  final String lastName;
  final String email;
  final String password;
  final String role; // 'tenant' | 'landlord'
  final String? phone;

  SignupRequest({
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.password,
    required this.role,
    this.phone,
  });

  Map<String, dynamic> toJson() => {
    'firstName': firstName,
    'lastName': lastName,
    'email': email,
    'password': password,
    'role': role,
    'phone': phone,
  };
}

class AuthResponse {
  final String token;
  final String email;
  final String role;
  final User user;

  AuthResponse({
    required this.token,
    required this.email,
    required this.role,
    required this.user,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    print('AuthResponse.fromJson - Full response: $json');

    // Handle different response structures
    final data = json['data'] ?? json;
    final userData = data['user'] ?? data;
    final tokenValue = data['accessToken'] ?? data['token'] ?? '';
    final roleValue = data['role'] ?? userData['role'] ?? 'tenant';
    final emailValue = userData['email'] ?? '';

    print(
      'AuthResponse - token: $tokenValue, email: $emailValue, role: $roleValue',
    );
    print('AuthResponse - user data: $userData');

    return AuthResponse(
      token: tokenValue,
      email: emailValue,
      role: roleValue,
      user: User.fromJson(userData),
    );
  }
}

class ApiResponse<T> {
  final bool success;
  final String? message;
  final T? data;
  final List<dynamic>? errors;

  ApiResponse({required this.success, this.message, this.data, this.errors});

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJsonT,
  ) {
    return ApiResponse(
      success: json['success'] ?? false,
      message: json['message'],
      data: json['data'] != null && fromJsonT != null
          ? fromJsonT(json['data'])
          : null,
      errors: json['errors'] as List<dynamic>?,
    );
  }
}

class PaginatedResponse<T> {
  final List<T> items;
  final int page;
  final int pageSize;
  final int totalItems;
  final int totalPages;

  PaginatedResponse({
    required this.items,
    required this.page,
    required this.pageSize,
    required this.totalItems,
    required this.totalPages,
  });

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJsonT,
  ) {
    List<T> items = [];
    if (json['items'] is List && fromJsonT != null) {
      items = (json['items'] as List).map((item) => fromJsonT(item)).toList();
    }

    return PaginatedResponse(
      items: items,
      page: json['page'] ?? 1,
      pageSize: json['pageSize'] ?? 20,
      totalItems: json['totalItems'] ?? 0,
      totalPages: json['totalPages'] ?? 1,
    );
  }
}
