import { useCallback } from "react";
import axiosInstance from "./axiosInstance";
import { useApiOperation, useFormSubmission } from "../hooks/useApiOperation";

// API Functions with enhanced error handling
export const authApi = {
  async login(userData: { email: string; password: string }) {
    const response = await axiosInstance.post("auth/", userData);
    return response.data;
  },

  async googleLogin(token: string) {
    const response = await axiosInstance.post("/auth/google-login", { token });
    return response.data;
  },

  async googleSignup(token: string, role: string) {
    const response = await axiosInstance.post("/auth/google-signup", {
      token,
      role,
    });
    return response.data;
  },

  async appleLogin(token: string) {
    const response = await axiosInstance.post("/auth/apple-login", { token });
    return response.data;
  },

  async appleSignup(token: string) {
    const response = await axiosInstance.post("/auth/apple-signup", { token });
    return response.data;
  },

  async logout() {
    const response = await axiosInstance.post("auth/logout");
    return response.data;
  },

  async register(userData: { email: string; password: string; role: string }) {
    const response = await axiosInstance.post("auth/signup", userData);
    return response.data;
  },

  async forgotPassword(userData: { email: string }) {
    const response = await axiosInstance.post("auth/forgot-password", userData);
    return response.data;
  },

  async resetPassword(data: { password: string; token?: string }) {
    const response = await axiosInstance.post("auth/reset-password", data);
    return response.data;
  },

  async verifyResetToken(data: { token?: string | null }) {
    const response = await axiosInstance.post(
      "auth/verify-reset-password-token",
      data
    );
    return response.data;
  },

  async verifyEmail(email: string, code: string) {
    const response = await axiosInstance.post("auth/verify-email", {
      email,
      code,
    });
    return response.data;
  },
};

// React Hook for Auth Operations
export const useAuthOperations = () => {
  const { executeOperation } = useApiOperation();
  const { submitForm } = useFormSubmission();

  const login = useCallback(
    async (userData: { email: string; password: string }) => {
      return submitForm(() => authApi.login(userData), {
        successMessage: "Login successful!",
        onSuccess: (data) => {
          console.log("User logged in successfully");
        },
        onValidationError: (errors) => {
          console.log("Login validation errors:", errors);
        },
      });
    },
    [submitForm]
  );

  const register = useCallback(
    async (userData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      password2?: string;
      role: string;
      terms: boolean;
    }) => {
      return submitForm(() => authApi.register(userData), {
        successMessage: "Registration successful!",
        onSuccess: (data) => {
          console.log("User registered successfully");
        },
        onValidationError: (errors) => {
          console.log("Registration validation errors:", errors);
        },
      });
    },
    [submitForm]
  );

  const googleLogin = useCallback(
    async (token: string) => {
      return executeOperation(() => authApi.googleLogin(token), {
        customErrorMessage: "Google login failed",
        onSuccess: (data) => {
          console.log("Google login successful");
        },
      });
    },
    [executeOperation]
  );

  const googleSignup = useCallback(
    async (token: string, role: string) => {
      return executeOperation(() => authApi.googleSignup(token, role), {
        customErrorMessage: "Google signup failed",
        onSuccess: (data) => {
          console.log("Google signup successful");
        },
      });
    },
    [executeOperation]
  );

  const appleLogin = useCallback(
    async (token: string) => {
      return executeOperation(() => authApi.appleLogin(token), {
        customErrorMessage: "Apple login failed",
        onSuccess: (data) => {
          console.log("Apple login successful");
        },
      });
    },
    [executeOperation]
  );

  const appleSignup = useCallback(
    async (token: string) => {
      return executeOperation(() => authApi.appleSignup(token), {
        customErrorMessage: "Apple signup failed",
        onSuccess: (data) => {
          console.log("Apple signup successful");
        },
      });
    },
    [executeOperation]
  );

  const logout = useCallback(async () => {
    return executeOperation(() => authApi.logout(), {
      customErrorMessage: "Logout failed",
      onSuccess: () => {
        console.log("User logged out successfully");
      },
    });
  }, [executeOperation]);

  const forgotPassword = useCallback(
    async (userData: { email: string }) => {
      return submitForm(() => authApi.forgotPassword(userData), {
        successMessage: "Password reset email sent!",
        onSuccess: () => {
          console.log("Password reset email sent");
        },
      });
    },
    [submitForm]
  );

  const resetPassword = useCallback(
    async (data: { password: string; token?: string }) => {
      return submitForm(() => authApi.resetPassword(data), {
        successMessage: "Password reset successful!",
        onSuccess: () => {
          console.log("Password reset successfully");
        },
      });
    },
    [submitForm]
  );

  const verifyResetToken = useCallback(
    async (data: { token?: string | null }) => {
      return executeOperation(() => authApi.verifyResetToken(data), {
        customErrorMessage: "Invalid or expired reset token",
        onSuccess: () => {
          console.log("Reset token verified");
        },
      });
    },
    [executeOperation]
  );

  const verifyEmail = useCallback(
    async (email: string, code: string) => {
      return executeOperation(() => authApi.verifyEmail(email, code), {
        customErrorMessage: "Email verification failed",
        onSuccess: () => {
          console.log("Email verified successfully");
        },
      });
    },
    [executeOperation]
  );

  return {
    login,
    register,
    googleLogin,
    googleSignup,
    appleLogin,
    appleSignup,
    logout,
    forgotPassword,
    resetPassword,
    verifyResetToken,
    verifyEmail,
  };
};

// Legacy exports for backward compatibility
export const loginApi = authApi.login;
export const googleLoginApi = authApi.googleLogin;
export const googleSignupApi = authApi.googleSignup;
export const appleLoginApi = authApi.appleLogin;
export const appleSignupApi = authApi.appleSignup;
export const logoutApi = authApi.logout;
export const registerApi = authApi.register;
export const forgotPasswordApi = authApi.forgotPassword;
export const resetPasswordApi = authApi.resetPassword;
export const verifyResetTokenApi = authApi.verifyResetToken;
export const verifyEmailApi = authApi.verifyEmail;
