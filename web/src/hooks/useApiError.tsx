import { useCallback } from "react";
import { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import type { ApiError } from "../apis/axiosInstance";

/**
 * Custom hook for handling API errors consistently across the application
 */
export const useApiError = () => {
  /**
   * Handle and display API errors
   * @param error - Axios error or regular error
   * @param customMessage - Optional custom error message
   * @param showNotification - Whether to show notification (default: true)
   */
  const handleError = useCallback(
    (
      error: AxiosError | Error | any,
      customMessage?: string,
      showNotification: boolean = true
    ) => {
      let errorInfo: ApiError;

      // Handle AxiosError with processed error info
      if (error.isAxiosError && error.processedError) {
        errorInfo = error.processedError;
      }
      // Handle AxiosError without processed info (fallback)
      else if (error.isAxiosError && error.response) {
        errorInfo = {
          message: error.response.data?.message || "An error occurred",
          status: error.response.status,
          code: error.response.data?.code,
        };
      }
      // Handle regular errors
      else {
        errorInfo = {
          message: error.message || "An unexpected error occurred",
          status: 0,
          code: "UNKNOWN_ERROR",
        };
      }

      // Use custom message if provided
      const displayMessage = customMessage || errorInfo.message;

      // Show notification if requested
      if (showNotification) {
        notifications.show({
          title: "Error",
          message: displayMessage,
          color: "red",
          position: "top-right",
          autoClose: 5000,
        });
      }

      // Log error for debugging
      console.error("API Error:", {
        message: displayMessage,
        status: errorInfo.status,
        code: errorInfo.code,
        originalError: error,
      });

      return errorInfo;
    },
    []
  );

  /**
   * Handle validation errors specifically
   * @param error - Validation error from API
   */
  const handleValidationError = useCallback((error: AxiosError) => {
    const responseData = error.response?.data as any;
    const validationErrors = responseData?.errors || {};

    // Show first validation error
    const firstError = Object.values(validationErrors)[0];
    if (firstError) {
      notifications.show({
        title: "Validation Error",
        message: Array.isArray(firstError) ? firstError[0] : String(firstError),
        color: "orange",
        position: "top-right",
        autoClose: 5000,
      });
    }

    return validationErrors;
  }, []);

  /**
   * Handle network errors specifically
   */
  const handleNetworkError = useCallback(() => {
    notifications.show({
      title: "Connection Error",
      message: "Please check your internet connection and try again.",
      color: "red",
      position: "top-right",
      autoClose: 7000,
    });
  }, []);

  return {
    handleError,
    handleValidationError,
    handleNetworkError,
  };
};
