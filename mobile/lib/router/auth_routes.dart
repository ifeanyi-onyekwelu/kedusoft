import 'package:flutter/material.dart';
import 'package:letsten/constants/app_routes.dart';
import 'package:letsten/models/user_model.dart';
import 'package:letsten/screens/auth/splash_screen.dart';
import 'package:letsten/screens/auth/login_screen.dart';
import 'package:letsten/screens/auth/register_screen.dart';
import 'package:letsten/screens/auth/signup_role_selection_screen.dart';
import 'package:letsten/screens/auth/email_verification_screen.dart';
import 'package:letsten/screens/auth/forgot_password_screen.dart';
import 'package:letsten/screens/auth/reset_password_screen.dart';

class AuthRoutes {
  static Route<dynamic>? generate(RouteSettings settings) {
    switch (settings.name) {
      // ── Splash ──────────────────────────────────────────
      case AppRoutes.splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());

      // ── Login & Register ────────────────────────────────
      case AppRoutes.login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());

      case AppRoutes.register:
        final role = settings.arguments as UserRole?;
        return MaterialPageRoute(builder: (_) => RegisterScreen(role: role));

      case AppRoutes.roleSelection:
        return MaterialPageRoute(
          builder: (_) => const SignupRoleSelectionScreen(),
        );

      // ── Email & Password ────────────────────────────────
      case AppRoutes.emailVerification:
        return MaterialPageRoute(
          builder: (_) => const EmailVerificationScreen(),
        );

      case AppRoutes.forgotPassword:
        return MaterialPageRoute(builder: (_) => const ForgotPasswordScreen());

      case AppRoutes.resetPassword:
        final email = settings.arguments as String? ?? '';
        return MaterialPageRoute(
          builder: (_) => ResetPasswordScreen(email: email),
        );

      default:
        return null;
    }
  }
}
