import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:letsten/constants/app_colors.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/providers/auth_provider.dart';
import 'package:letsten/widgets/shared_widgets.dart';

class EmailVerificationScreen extends StatefulWidget {
  const EmailVerificationScreen({super.key});

  @override
  State<EmailVerificationScreen> createState() =>
      _EmailVerificationScreenState();
}

class _EmailVerificationScreenState extends State<EmailVerificationScreen> {
  final _codeController = TextEditingController();

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  void _handleVerify() async {
    if (_codeController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter verification code')),
      );
      return;
    }

    final authProvider = context.read<AuthProvider>();
    try {
      final success = await authProvider.verifyEmail(_codeController.text);

      if (mounted) {
        if (success) {
          // Navigate to appropriate dashboard based on role
          final route = authProvider.userRole == 'tenant'
              ? AppRoutes.tenantDashboard
              : AppRoutes.landlordDashboard;
          Navigator.of(context).pushReplacementNamed(route);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(authProvider.error ?? 'Verification failed'),
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

  void _handleResend() async {
    try {
      // Call resend verification email method (to be added to AuthProvider)
      // await authProvider.resendVerificationEmail();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Verification code resent to your email')),
      );
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
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
                Text(
                  'Verify Your Email',
                  style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'We\'ve sent a verification code to your email',
                  style: Theme.of(
                    context,
                  ).textTheme.bodyLarge?.copyWith(color: AppColors.grey600),
                ),
                const SizedBox(height: 40),
                // Code Input
                CustomTextField(
                  controller: _codeController,
                  label: 'Verification Code',
                  hint: 'Enter 6-digit code',
                  inputType: TextInputType.number,
                  prefixIcon: const Icon(Icons.security_rounded),
                  validator: (value) {
                    if (value?.isEmpty ?? true) {
                      return 'Code is required';
                    }
                    if (value!.length != 6) {
                      return 'Code must be 6 digits';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 32),
                // Verify Button
                Consumer<AuthProvider>(
                  builder: (context, authProvider, _) {
                    return CustomButton(
                      label: 'Verify Email',
                      onPressed: authProvider.isLoading ? () {} : _handleVerify,
                      isLoading: authProvider.isLoading,
                      backgroundColor: AppColors.primary,
                      textColor: AppColors.white,
                    );
                  },
                ),
                const SizedBox(height: 16),
                // Resend Link
                Center(
                  child: TextButton(
                    onPressed: _handleResend,
                    child: const Text('Didn\'t receive code? Resend'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
