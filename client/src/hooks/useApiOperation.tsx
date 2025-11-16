import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import { useApiError } from "./useApiError";
import { useLoading } from "./useLoading";
import type { ApiError } from "../apis/axiosInstance";

// Define types for better type safety
type ProcessedError =
  | ApiError
  | { type: string; errors: any }
  | { type: string; message: string };

/**
 * Enhanced hook for handling API operations with better error handling and loading states
 */
export const useApiOperation = () => {
  const { handleError, handleValidationError, handleNetworkError } =
    useApiError();
  const { loading, withLoading } = useLoading();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<ProcessedError | null>(null);

  /**
   * Execute an API operation with comprehensive error handling
   */
  const executeOperation = useCallback(
    async (
      operation: () => Promise<any>,
      options?: {
        onSuccess?: (data: any) => void;
        onError?: (error: any) => void;
        showErrorNotification?: boolean;
        customErrorMessage?: string;
      }
    ) => {
      const {
        onSuccess,
        onError,
        showErrorNotification = true,
        customErrorMessage,
      } = options || {};

      setError(null);

      try {
        const result = await withLoading(operation());
        setData(result);

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (error: any) {
        let processedError = null;

        // Handle different types of errors
        if (error.isAxiosError) {
          const axiosError = error as AxiosError;

          // Network errors
          if (!axiosError.response) {
            handleNetworkError();
            processedError = {
              type: "network",
              message: "Network connection failed",
            };
          }
          // Validation errors (400)
          else if (axiosError.response.status === 400) {
            const validationErrors = handleValidationError(axiosError);
            processedError = { type: "validation", errors: validationErrors };
          }
          // Other API errors
          else {
            processedError = handleError(
              axiosError,
              customErrorMessage,
              showErrorNotification
            );
          }
        } else {
          // Generic errors
          processedError = handleError(
            error,
            customErrorMessage,
            showErrorNotification
          );
        }

        setError(processedError);

        if (onError) {
          onError(processedError);
        }

        throw processedError;
      }
    },
    [handleError, handleValidationError, handleNetworkError, withLoading]
  );

  /**
   * Reset the hook state
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    error,
    loading,
    executeOperation,
    reset,
  };
};

/**
 * Enhanced hook specifically for form submissions
 */
export const useFormSubmission = () => {
  const { executeOperation, loading, error, reset } = useApiOperation();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const submitForm = useCallback(
    async (
      submitFunction: () => Promise<any>,
      options?: {
        onSuccess?: (data: any) => void;
        onValidationError?: (errors: Record<string, string[]>) => void;
        successMessage?: string;
      }
    ) => {
      const { onSuccess, onValidationError, successMessage } = options || {};

      setValidationErrors({});

      try {
        const result = await executeOperation(submitFunction, {
          onSuccess: (data) => {
            if (successMessage) {
              // Show success notification
              console.log(successMessage);
            }
            if (onSuccess) {
              onSuccess(data);
            }
          },
          showErrorNotification: false, // Handle errors manually
        });

        return result;
      } catch (error: any) {
        if (error.type === "validation") {
          setValidationErrors(error.errors);
          if (onValidationError) {
            onValidationError(error.errors);
          }
        } else {
          // Re-throw non-validation errors to be handled by the component
          throw error;
        }
      }
    },
    [executeOperation]
  );

  const resetForm = useCallback(() => {
    reset();
    setValidationErrors({});
  }, [reset]);

  return {
    submitForm,
    loading,
    error,
    validationErrors,
    reset: resetForm,
  };
};

/**
 * Hook for handling paginated API calls
 */
export const usePaginatedApi = (initialData: any[] = []) => {
  const { executeOperation, loading, error } = useApiOperation();
  const [data, setData] = useState(initialData);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
  });
  const [loadingMore, setLoadingMore] = useState(false);

  const loadData = useCallback(
    async (
      apiCall: (page: number) => Promise<any>,
      page: number = 1,
      append: boolean = false
    ) => {
      try {
        const result = await executeOperation(() => apiCall(page));

        if (result && result.data) {
          setData((prev) => (append ? [...prev, ...result.data] : result.data));
        }

        if (result && result.pagination) {
          setPagination({
            page: result.pagination.page,
            totalPages: result.pagination.pages || result.pagination.totalPages,
            total: result.pagination.total,
            hasMore:
              result.pagination.page <
              (result.pagination.pages || result.pagination.totalPages),
          });
        }

        return result;
      } catch (error) {
        throw error;
      }
    },
    [executeOperation]
  );

  const loadMore = useCallback(
    async (apiCall: (page: number) => Promise<any>) => {
      if (!pagination.hasMore || loadingMore) return;

      setLoadingMore(true);
      try {
        await loadData(apiCall, pagination.page + 1, true);
      } finally {
        setLoadingMore(false);
      }
    },
    [loadData, pagination.hasMore, pagination.page, loadingMore]
  );

  const refresh = useCallback(
    async (apiCall: (page: number) => Promise<any>) => {
      await loadData(apiCall, 1, false);
    },
    [loadData]
  );

  return {
    data,
    pagination,
    loading,
    loadingMore,
    error,
    loadData,
    loadMore,
    refresh,
  };
};
