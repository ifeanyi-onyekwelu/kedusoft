import { useCallback } from "react";
import axiosInstance from "./axiosInstance";
import { useApiOperation, useFormSubmission } from "../hooks/useApiOperation";

// ==============================================
// API FUNCTIONS
// ==============================================

export const adminApi = {
  // User Management
  async getAllUsers() {
    const response = await axiosInstance.get("admin/users/accounts");
    return response.data;
  },

  async getUserById(userId: string) {
    const response = await axiosInstance.get(`admin/users/accounts/${userId}`);
    return response.data;
  },

  async updateUser(userId: string, data: any) {
    const response = await axiosInstance.put(`admin/users/${userId}`, data);
    return response.data;
  },

  // Applications Management
  async getAllApplications() {
    const response = await axiosInstance.get("admin/applications");
    return response.data;
  },

  async getApplicationById(applicationId: string) {
    const response = await axiosInstance.get(
      `admin/applications/${applicationId}`
    );
    return response.data;
  },

  // Properties Management
  async getAllProperties() {
    const response = await axiosInstance.get("admin/properties");
    return response.data;
  },

  async getPropertyById(propertyId: string) {
    const response = await axiosInstance.get(`admin/properties/${propertyId}`);
    return response.data;
  },

  // Transactions Management
  async getAllTransactions() {
    const response = await axiosInstance.get("admin/transactions");
    return response.data;
  },

  async getTransactionById(transactionId: string) {
    const response = await axiosInstance.get(
      `admin/transactions/${transactionId}`
    );
    return response.data;
  },
};

// ==============================================
// REACT HOOKS FOR ADMIN OPERATIONS
// ==============================================

export const useAdminOperations = () => {
  const { executeOperation } = useApiOperation();
  const { submitForm } = useFormSubmission();

  // User Management Operations
  const getAllUsers = useCallback(async () => {
    return executeOperation(() => adminApi.getAllUsers(), {
      customErrorMessage: "Failed to load users",
    });
  }, [executeOperation]);

  const getUserById = useCallback(
    async (userId: string) => {
      return executeOperation(() => adminApi.getUserById(userId), {
        customErrorMessage: "Failed to load user details",
      });
    },
    [executeOperation]
  );

  const updateUser = useCallback(
    async (userId: string, data: any) => {
      return submitForm(() => adminApi.updateUser(userId, data), {
        successMessage: "User updated successfully!",
        onSuccess: (data) => {
          console.log("User updated:", data);
        },
        onValidationError: (errors) => {
          console.log("User update validation errors:", errors);
        },
      });
    },
    [submitForm]
  );

  // Application Management Operations
  const getAllApplications = useCallback(async () => {
    return executeOperation(() => adminApi.getAllApplications(), {
      customErrorMessage: "Failed to load applications",
    });
  }, [executeOperation]);

  const getApplicationById = useCallback(
    async (applicationId: string) => {
      return executeOperation(
        () => adminApi.getApplicationById(applicationId),
        {
          customErrorMessage: "Failed to load application details",
        }
      );
    },
    [executeOperation]
  );

  // Property Management Operations
  const getAllProperties = useCallback(async () => {
    return executeOperation(() => adminApi.getAllProperties(), {
      customErrorMessage: "Failed to load properties",
    });
  }, [executeOperation]);

  const getPropertyById = useCallback(
    async (propertyId: string) => {
      return executeOperation(() => adminApi.getPropertyById(propertyId), {
        customErrorMessage: "Failed to load property details",
      });
    },
    [executeOperation]
  );

  // Transaction Management Operations
  const getAllTransactions = useCallback(async () => {
    return executeOperation(() => adminApi.getAllTransactions(), {
      customErrorMessage: "Failed to load transactions",
    });
  }, [executeOperation]);

  const getTransactionById = useCallback(
    async (transactionId: string) => {
      return executeOperation(
        () => adminApi.getTransactionById(transactionId),
        {
          customErrorMessage: "Failed to load transaction details",
        }
      );
    },
    [executeOperation]
  );

  return {
    // User operations
    getAllUsers,
    getUserById,
    updateUser,

    // Application operations
    getAllApplications,
    getApplicationById,

    // Property operations
    getAllProperties,
    getPropertyById,

    // Transaction operations
    getAllTransactions,
    getTransactionById,
  };
};

// ==============================================
// LEGACY EXPORTS FOR BACKWARD COMPATIBILITY
// ==============================================

export const getAllUsers = adminApi.getAllUsers;
export const getUserById = adminApi.getUserById;
export const updateUser = adminApi.updateUser;
export const getAllApplications = adminApi.getAllApplications;
export const getApplicationById = adminApi.getApplicationById;
export const getAllProperties = adminApi.getAllProperties;
export const getPropertyById = adminApi.getPropertyById;
export const getAllTransactions = adminApi.getAllTransactions;
export const getTransactionById = adminApi.getTransactionById;
