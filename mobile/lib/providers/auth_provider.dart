import 'package:flutter/material.dart';
import 'package:letsten/models/user_model.dart';
import '../services/service_locator.dart';

class AuthProvider extends ChangeNotifier {
  bool _isLoggedIn = false;
  String? _userEmail;
  User? _user;
  bool _isLoading = false;
  String? _error;
  String? _userRole;

  // Getters
  bool get isLoggedIn => _isLoggedIn;
  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String? get userRole => _userRole;
  String? get userEmail => _userEmail;

  final authService = serviceLocator.authService;
  final profileService = serviceLocator.profileService;

  Future<void> initialize() async {
    _isLoading = true;
    try {
      final loggedIn = await authService.isLoggedIn();

      if (loggedIn) {
        _isLoggedIn = true;
        await authService.initializeTokenFromStorage();

        // Restore user role from storage
        _userRole = await authService.getUserRole();

        // Restore user data from storage first
        _user = await authService.getUser();

        // Try to refresh user profile from server
        try {
          await fetchUserProfile();
        } catch (e) {}
      }
    } catch (e) {
      print('AuthProvider.initialize - Error: $e');
      _error = e.toString();
      _isLoggedIn = false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchUserProfile() async {
    try {
      _user = await profileService.getProfile();
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    try {
      final response = await authService.login(
        email: email,
        password: password,
      );

      _isLoggedIn = true;
      _userEmail = response.email;
      _userRole = response.role;
      _user = response.user;
      _error = null;

      // Fetch complete user profile with all details
      await fetchUserProfile();

      notifyListeners();
      return true;
    } catch (e) {
      print('AuthProvider.login - Error: $e');
      _error = e.toString();
      _isLoggedIn = false;
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
    }
  }

  Future<bool> signup({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required String passwordConfirm,
    required String role,
  }) async {
    _isLoading = true;
    _error = null;

    print("BEFORE SIGNUP - Role: $role, Email: $email");
    try {
      await authService.signup(
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
        role: role,
      );

      _isLoggedIn = true;
      _error = null;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoggedIn = false;
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
    }
  }

  Future<bool> verifyEmail(String code) async {
    _isLoading = true;
    _error = null;
    try {
      await authService.verifyEmail(email: _userEmail!, code: code);
      _error = null;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
    }
  }

  Future<void> sendForgotPasswordCode(String email) async {
    _isLoading = true;
    _error = null;
    try {
      await authService.forgotPassword(email: email);
      _userEmail = email;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      rethrow;
    } finally {
      _isLoading = false;
    }
  }

  Future<void> resetPassword({
    required String email,
    required String code,
    required String newPassword,
    required String confirmPassword,
  }) async {
    _isLoading = true;
    _error = null;
    try {
      await authService.resetPassword(
        email: email,
        code: code,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      );
      _error = null;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      rethrow;
    } finally {
      _isLoading = false;
    }
  }

  Future<bool> loginWithGoogle() async {
    _isLoading = true;
    _error = null;
    try {
      // This will be handled by the service layer
      // For now, placeholder
      _error = 'Google login not yet configured';
      notifyListeners();
      return false;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
    }
  }

  Future<bool> signupWithGoogle() async {
    _isLoading = true;
    _error = null;
    try {
      // This will be handled by the service layer
      _error = 'Google signup not yet configured';
      notifyListeners();
      return false;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
    }
  }

  Future<void> logout() async {
    _isLoading = true;
    try {
      await authService.logout();
      _isLoggedIn = false;
      _userEmail = null;
      _user = null;
      _userRole = null;
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
