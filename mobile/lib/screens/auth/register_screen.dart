import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/constants/app_strings.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/models/user_model.dart';
import 'package:letsten/providers/auth_provider.dart';
import 'package:letsten/widgets/shared_widgets.dart';

class RegisterScreen extends StatefulWidget {
  final UserRole? role;

  const RegisterScreen({super.key, this.role});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _fullNameController = TextEditingController();
  bool _agreedToTerms = false;

  UserRole? _selectedRole;

  @override
  void initState() {
    super.initState();
    _selectedRole = widget.role;
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _fullNameController.dispose();
    super.dispose();
  }

  void _handleRegister() async {
    print(
      "Attempting to register with Role: $_selectedRole, Email: ${_emailController.text.trim()}",
    );

    if (_formKey.currentState!.validate() && _selectedRole != null) {
      final authProvider = context.read<AuthProvider>();

      try {
        // Split full name into first and last name
        final nameParts = _fullNameController.text.trim().split(' ');
        final firstName = nameParts.isNotEmpty ? nameParts[0] : '';
        final lastName = nameParts.length > 1
            ? nameParts.sublist(1).join(' ')
            : '';

        final success = await authProvider.signup(
          firstName: firstName,
          lastName: lastName,
          email: _emailController.text.trim(),
          password: _passwordController.text,
          passwordConfirm: _confirmPasswordController.text,
          role: _selectedRole!
              .toString()
              .split('.')
              .last, // Convert enum to string
        );

        print("Signup success: $success, Role: ${_selectedRole.toString()}");

        if (mounted) {
          if (success) {
            Navigator.of(
              context,
            ).pushReplacementNamed(AppRoutes.emailVerification);
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(authProvider.error ?? 'Registration failed'),
              ),
            );
          }
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Text(
                  AppStrings.createAccount,
                  style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Join ${AppStrings.appName} today',
                  style: Theme.of(
                    context,
                  ).textTheme.bodyLarge?.copyWith(color: AppColors.grey600),
                ),
                const SizedBox(height: 32),
                // Form
                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      // Full Name
                      CustomTextField(
                        label: 'Full Name',
                        hint: 'John Doe',
                        controller: _fullNameController,
                        inputType: TextInputType.text,
                        prefixIcon: const Icon(Icons.person_outlined),
                        validator: (value) {
                          if (value?.isEmpty ?? true) {
                            return AppStrings.fieldRequired;
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      // Email
                      CustomTextField(
                        label: AppStrings.email,
                        hint: 'your@email.com',
                        controller: _emailController,
                        inputType: TextInputType.emailAddress,
                        prefixIcon: const Icon(Icons.email_outlined),
                        validator: (value) {
                          if (value?.isEmpty ?? true) {
                            return AppStrings.fieldRequired;
                          }
                          if (!value!.contains('@')) {
                            return AppStrings.invalidEmail;
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      // Password
                      CustomTextField(
                        label: AppStrings.password,
                        hint: 'At least 6 characters',
                        controller: _passwordController,
                        inputType: TextInputType.text,
                        obscureText: true,
                        prefixIcon: const Icon(Icons.lock_outlined),
                        validator: (value) {
                          if (value?.isEmpty ?? true) {
                            return AppStrings.fieldRequired;
                          }
                          if ((value?.length ?? 0) < 6) {
                            return AppStrings.passwordTooShort;
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      // Confirm Password
                      CustomTextField(
                        label: AppStrings.confirmPassword,
                        hint: 'Confirm your password',
                        controller: _confirmPasswordController,
                        inputType: TextInputType.text,
                        obscureText: true,
                        prefixIcon: const Icon(Icons.lock_outlined),
                        validator: (value) {
                          if (value?.isEmpty ?? true) {
                            return AppStrings.fieldRequired;
                          }
                          if (value != _passwordController.text) {
                            return AppStrings.passwordMismatch;
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),
                      // Terms Checkbox
                      CheckboxListTile(
                        value: _agreedToTerms,
                        onChanged: (value) {
                          setState(() => _agreedToTerms = value ?? false);
                        },
                        contentPadding: EdgeInsets.zero,
                        title: const Text(
                          'I agree to Terms & Conditions',
                          style: TextStyle(fontSize: 14),
                        ),
                        controlAffinity: ListTileControlAffinity.leading,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                // Register Button
                Consumer<AuthProvider>(
                  builder: (context, authProvider, _) {
                    return CustomButton(
                      label: AppStrings.createAccount,
                      onPressed: _agreedToTerms && !authProvider.isLoading
                          ? _handleRegister
                          : () {},
                      isLoading: authProvider.isLoading,
                      backgroundColor: AppColors.primary,
                      textColor: AppColors.white,
                      disabled: !_agreedToTerms || authProvider.isLoading,
                    );
                  },
                ),
                const SizedBox(height: 24),
                // Divider
                Row(
                  children: [
                    Expanded(
                      child: Container(height: 1, color: AppColors.grey300),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        'Or sign up with',
                        style: TextStyle(color: AppColors.grey600),
                      ),
                    ),
                    Expanded(
                      child: Container(height: 1, color: AppColors.grey300),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                // Social Signup Buttons
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Google
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          final authProvider = context.read<AuthProvider>();
                          authProvider.signupWithGoogle();
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Google signup coming soon'),
                            ),
                          );
                        },
                        icon: const Icon(Icons.g_mobiledata_rounded, size: 20),
                        label: const Text('Google'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          side: BorderSide(color: AppColors.grey300),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    // Apple
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          final authProvider = context.read<AuthProvider>();
                          authProvider.signupWithGoogle();
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Apple signup coming soon'),
                            ),
                          );
                        },
                        icon: const Icon(Icons.apple, size: 20),
                        label: const Text('Apple'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          side: BorderSide(color: AppColors.grey300),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                // Login Link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(AppStrings.alreadyHaveAccount),
                    TextButton(
                      onPressed: () {
                        Navigator.of(
                          context,
                        ).pushReplacementNamed(AppRoutes.login);
                      },
                      child: const Text(
                        AppStrings.login,
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
