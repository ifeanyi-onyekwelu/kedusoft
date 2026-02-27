import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";

// Extend AxiosError to include processedError
interface AxiosErrorWithProcessed extends AxiosError {
  processedError?: ApiError;
}

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Enhanced error interface for better type safety
interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Enhanced API Error Handler Class
class ApiErrorHandler {
  /**
   * Centralized error handling logic
   * @param error - Axios error object
   * @returns Formatted API error
   */
  static handle(error: AxiosError): ApiError {
    const response = error.response;

    // Network/Connection errors
    if (!response) {
      this.handleNetworkError();
      return {
        message: "Network error. Please check your internet connection.",
        status: 0,
        code: "NETWORK_ERROR",
      };
    }

    // Handle different HTTP status codes
    switch (response.status) {
      case 401:
        this.handleUnauthorized();
        break;
      case 403:
        this.handleForbidden();
        break;
      case 404:
        this.handleNotFound();
        break;
      case 429:
        this.handleRateLimit(response.data);
        break;
      case 500:
      case 502:
      case 503:
        this.handleServerError(error);
        break;
      default:
        break;
    }

    return {
      message:
        (response.data &&
        typeof response.data === "object" &&
        "message" in response.data
          ? (response.data as { message?: string }).message
          : undefined) || this.getDefaultMessage(response.status),
      status: response.status,
      code:
        response.data &&
        typeof response.data === "object" &&
        "code" in response.data
          ? (response.data as { code?: string }).code
          : undefined,
      details:
        response.data &&
        typeof response.data === "object" &&
        "details" in response.data
          ? (response.data as { details?: any }).details
          : undefined,
    };
  }

  private static handleUnauthorized(): void {
    console.warn("🚨 Authentication failed - analyzing request");

    const currentPath = window.location.pathname;
    const token = localStorage.getItem("token");

    // Enhanced debugging for messaging requests
    if (
      currentPath.includes("messages") ||
      currentPath.includes("property-owner")
    ) {
      console.log("📨 Messaging/Landlord request failed:", {
        path: currentPath,
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + "..." : "none",
      });

      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const { role, exp } = decoded;

          console.log("🔍 Token details:", {
            role,
            exp,
            currentTime: Date.now() / 1000,
            isExpired: exp < Date.now() / 1000,
            timeUntilExpiry: exp - Date.now() / 1000,
          });

          // If token is valid but we got 401, it might be a backend role issue
          if (exp > Date.now() / 1000) {
            console.error(
              "🤔 Valid token but 401 response - possible backend role mismatch"
            );
            alert(
              "Authentication issue detected. Please log out and log back in."
            );
            // Don't redirect immediately, let user decide
            return;
          }
        } catch (error) {
          console.error("❌ Token decode error:", error);
        }
      }
    }

    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Only redirect if not already on auth page
    if (!currentPath.startsWith("/auth")) {
      // Store current page for redirect after login
      localStorage.setItem("redirectAfterLogin", currentPath);
      console.log("🔄 Redirecting to login, will return to:", currentPath);
      window.location.href = "/auth/login";
    }
  }

  private static handleForbidden(): void {
    console.warn("Access forbidden - insufficient permissions");
    // Could redirect to unauthorized page or show modal
  }

  private static handleNotFound(): void {
    console.warn("Resource not found");
  }

  private static handleRateLimit(data: any): void {
    console.warn("Rate limit exceeded", data);
    // Could show rate limit modal or notification
  }

  private static handleServerError(error: AxiosError): void {
    console.error("Server error occurred:", error);

    // Send to error tracking service (Sentry, LogRocket, etc.)
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.captureException(error);
    }

    // Only redirect to error page for 500 errors, not 502/503 which might be temporary
    // if (
    //   error.response?.status === 500 &&
    //   !window.location.pathname.includes("error-500")
    // ) {
    //   window.location.href = "/error-500";
    // }
  }

  private static handleNetworkError(): void {
    console.error("Network error - possibly offline");
    // Could show offline indicator
  }

  private static getDefaultMessage(status: number): string {
    const messages: Record<number, string> = {
      400: "Invalid request. Please check your input.",
      401: "Authentication required. Please log in.",
      403: "You don't have permission to access this resource.",
      404: "The requested resource was not found.",
      429: "Too many requests. Please try again later.",
      500: "Internal server error. Please try again later.",
      502: "Service temporarily unavailable.",
      503: "Service unavailable. Please try again later.",
    };

    return messages[status] || "An unexpected error occurred.";
  }
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Enhanced Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Extra debugging for messaging requests
      if (
        config.url?.includes("/messaging") ||
        config.url?.includes("/messages")
      ) {
        try {
          const decoded: any = jwtDecode(token);
          console.log("📨 Messaging request with token:", {
            url: config.url,
            method: config.method,
            role: decoded.role,
            tokenValid: decoded.exp > Date.now() / 1000,
          });
        } catch (error) {
          console.error("Token decode error in request interceptor:", error);
        }
      }
    }

    // Add request ID for tracking
    config.headers["X-Request-ID"] = `req_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          headers: config.headers,
          data: config.data,
        }
      );
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Enhanced Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(
        `✅ API Response: ${response.status} ${response.config.url}`,
        {
          data: response.data,
          status: response.status,
        }
      );
    }

    return {
      ...response,
      data: response.data?.data || response.data,
      message: response.data?.message,
      status: response.status,
    };
  },
  (error: AxiosError) => {
    // Enhanced error logging
    console.error(`❌ API Error: ${error.config?.url}`, {
      status: error.response?.status,
      message: error.response?.data,
      config: error.config,
    });

    // Process error through handler
    const processedError = ApiErrorHandler.handle(error);

    // Attach processed error info to the original error
    (error as AxiosErrorWithProcessed).processedError = processedError;

    return Promise.reject(error);
  }
);

// Export types and instance
export type { ApiError };
export { ApiErrorHandler };
export default axiosInstance;
