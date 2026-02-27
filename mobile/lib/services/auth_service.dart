import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'api_config.dart';
import 'http_client.dart';
import '../models/api_models.dart';
import '../models/user_model.dart';

class AuthService {
  final HttpClient _httpClient;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';
  static const String _roleKey = 'user_role';

  AuthService(this._httpClient);

  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      final request = LoginRequest(email: email, password: password);
      final response = await _httpClient.post<AuthResponse>(
        ApiConfig.loginEndpoint,
        data: request.toJson(),
        fromJson: (json) => AuthResponse.fromJson(json),
      );

      await _saveToken(response.token);
      await _saveRole(response.role);
      await _saveUser(response.user);

      _httpClient.setToken(response.token);

      return response;
    } on DioException catch (e) {
      final message =
          e.response?.data['message'] ?? 'Invalid email or password.';
      throw Exception(message);
    } catch (e) {
      print('Login error: $e');
      throw Exception('Something went wrong. Try again.');
    }
  }

  Future<AuthResponse> signup({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required String passwordConfirm,
    required String role,
    String? phone,
  }) async {
    try {
      if (password != passwordConfirm) {
        throw Exception('Passwords do not match');
      }

      final request = SignupRequest(
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: role,
        phone: phone,
      );

      final response = await _httpClient.post<AuthResponse>(
        ApiConfig.signupEndpoint,
        data: request.toJson(),
        fromJson: (json) => AuthResponse.fromJson(json),
      );

      await _saveToken(response.token);
      await _saveRole(response.role);
      await _saveUser(response.user);

      _httpClient.setToken(response.token);

      return response;
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    try {
      // Call logout endpoint if needed
      // await _httpClient.post(ApiConfig.logoutEndpoint);

      await _clearToken();
      await _clearUser();
      await _clearRole();

      _httpClient.setToken(null);
    } catch (e) {
      // Clear local data anyway
      await _clearToken();
      await _clearUser();
      await _clearRole();
      rethrow;
    }
  }

  Future<void> sendVerificationEmail({required String email}) async {
    try {
      await _httpClient.post(
        ApiConfig.sendVerificationEndpoint,
        data: {'email': email},
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> verifyEmail({
    required String email,
    required String code,
  }) async {
    try {
      await _httpClient.post(
        ApiConfig.verifyEmailEndpoint,
        data: {'email': email, 'code': code},
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> forgotPassword({required String email}) async {
    try {
      await _httpClient.post(
        ApiConfig.forgotPasswordEndpoint,
        data: {'email': email},
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> resetPassword({
    required String email,
    required String code,
    required String newPassword,
    required String confirmPassword,
  }) async {
    try {
      if (newPassword != confirmPassword) {
        throw Exception('Passwords do not match');
      }

      await _httpClient.post(
        ApiConfig.resetPasswordEndpoint,
        data: {'email': email, 'code': code, 'password': newPassword},
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<String?> getToken() async {
    return await _secureStorage.read(key: _tokenKey);
  }

  Future<String?> getUserRole() async {
    return await _secureStorage.read(key: _roleKey);
  }

  Future<User?> getUser() async {
    final userJson = await _secureStorage.read(key: _userKey);

    if (userJson != null) {
      try {
        final decoded = jsonDecode(userJson);
        final user = User.fromJson(decoded);

        return user;
      } catch (e) {
        print('Error decoding user data: $e');
        return null;
      }
    }
    return null;
  }

  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  Future<void> _saveToken(String token) async {
    await _secureStorage.write(key: _tokenKey, value: token);
  }

  Future<void> _saveRole(String role) async {
    await _secureStorage.write(key: _roleKey, value: role);
  }

  Future<void> _saveUser(User user) async {
    try {
      final json = user.toJson();
      final encoded = jsonEncode(json);
      await _secureStorage.write(key: _userKey, value: encoded);
      print('_saveUser - Successfully saved user data');
    } catch (e) {
      print('Error saving user data: $e');
    }
  }

  Future<void> _clearToken() async {
    await _secureStorage.delete(key: _tokenKey);
  }

  Future<void> _clearUser() async {
    await _secureStorage.delete(key: _userKey);
  }

  Future<void> _clearRole() async {
    await _secureStorage.delete(key: _roleKey);
  }

  Future<void> initializeTokenFromStorage() async {
    final token = await getToken();
    if (token != null) {
      _httpClient.setToken(token);
    }
  }
}
