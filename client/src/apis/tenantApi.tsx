import { useCallback } from "react";
import axiosInstance from "./axiosInstance";
import { useApiOperation, useFormSubmission } from "../hooks/useApiOperation";

/**
 * Tenant API Service
 * Contains all API endpoints related to tenant operations with enhanced error handling
 */

// ==============================================
// API FUNCTIONS
// ==============================================

export const tenantApi = {
  // Applications
  async getAllApplications() {
    const response = await axiosInstance.get("tenant/applications");
    return response.data;
  },

  async getApplication(applicationId: string) {
    const response = await axiosInstance.get(
      `tenant/applications/${applicationId}`
    );
    return response.data;
  },

  async deleteApplication(applicationId: string) {
    const response = await axiosInstance.delete(
      `tenant/applications/${applicationId}`
    );
    return response.data;
  },

  async applyForProperty(data: any) {
    const response = await axiosInstance.post(
      `tenant/properties/${data.propertyId}/applications`,
      data
    );
    return response.data;
  },

  // Search History
  async createHistory() {
    const response = await axiosInstance.get("tenant/search-history");
    return response.data;
  },

  async getHistory() {
    const response = await axiosInstance.get("tenant/search-history");
    return response.data;
  },

  async clearHistory() {
    const response = await axiosInstance.delete("tenant/search-history");
    return response.data;
  },

  // Transactions
  async getAllTransactions() {
    const response = await axiosInstance.get("tenant/transactions");
    return response.data;
  },

  async getTransaction(transactionId: string) {
    const response = await axiosInstance.get(
      `tenant/transactions/${transactionId}`
    );
    return response.data;
  },

  async getLikedProperties() {
    const response = await axiosInstance.get("tenant/properties/liked");
    return response.data;
  },

  async likeProperty(propertyId: string) {
    const response = await axiosInstance.post(
      `tenant/properties/${propertyId}/like`
    );
    return response.data;
  },

  async unlikeProperty(likeId: string) {
    const response = await axiosInstance.delete(
      `tenant/properties/${likeId}/unlike`
    );
    return response.data;
  },

  async checkIfLiked(propertyId: string) {
    const response = await axiosInstance.get(
      `tenant/properties/${propertyId}/like-status`
    );
    return response.data;
  },

  // Leases
  async signLease(leaseId: string, signature: string) {
    const response = await axiosInstance.post(`tenant/leases/${leaseId}/sign`, {
      signature,
    });
    return response.data;
  },

  async getAllPendingLeases() {
    const response = await axiosInstance.get("tenant/leases");
    return response.data;
  },

  async getAllLeases() {
    const response = await axiosInstance.get("tenant/all-leases");
    return response.data;
  },

  // Recommendations
  async createRecommendation(data: any) {
    const response = await axiosInstance.post("tenant/recommendations", data);
    return response.data;
  },

  async updateRecommendation(recommendationId: string, data: any) {
    const response = await axiosInstance.put(
      `tenant/recommendations/${recommendationId}`,
      data
    );
    return response.data;
  },

  async getRecommendedProperties(params?: {
    page?: number;
    per_page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.per_page)
      queryParams.append("per_page", params.per_page.toString());

    const response = await axiosInstance.get(
      `tenant/recommendations/properties?${queryParams}`
    );
    return response.data;
  },

  // Screening Operations
  async getAllScreenings() {
    const response = await axiosInstance.get("tenant/screenings");
    return response.data;
  },

  async getScreeningDetails(screeningId: string) {
    const response = await axiosInstance.get(
      `tenant/screenings/${screeningId}`
    );
    return response.data;
  },

  async getScreeningNotifications() {
    const response = await axiosInstance.get("tenant/screenings/notifications");
    return response.data;
  },

  async updateScreening(
    screeningId: string,
    data: {
      income?: number;
      employment_status?: string;
      previous_rental_history?: string;
      references?: string;
      additional_documents?: File[];
    }
  ) {
    const formData = new FormData();

    // Add text fields
    if (data.income) formData.append("income", data.income.toString());
    if (data.employment_status)
      formData.append("employment_status", data.employment_status);
    if (data.previous_rental_history)
      formData.append("previous_rental_history", data.previous_rental_history);
    if (data.references) formData.append("references", data.references);

    // Add file uploads
    if (data.additional_documents) {
      data.additional_documents.forEach((file) => {
        formData.append(`additional_documents`, file);
      });
    }

    const response = await axiosInstance.patch(
      `tenant/screenings/${screeningId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Recent Activities
  async getRecentActivities(params?: { limit?: number; days?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.days) queryParams.append("days", params.days.toString());

    const response = await axiosInstance.get(
      `tenant/activities/recent?${queryParams}`
    );
    return response.data;
  },
};

// ==============================================
// REACT HOOKS FOR TENANT OPERATIONS
// ==============================================

export const useTenantOperations = () => {
  const { executeOperation } = useApiOperation();
  const { submitForm } = useFormSubmission();

  // Application Operations
  const getAllApplications = useCallback(async () => {
    return executeOperation(() => tenantApi.getAllApplications(), {
      customErrorMessage: "Failed to load applications",
    });
  }, [executeOperation]);

  const getApplication = useCallback(
    async (applicationId: string) => {
      return executeOperation(() => tenantApi.getApplication(applicationId), {
        customErrorMessage: "Failed to load application details",
      });
    },
    [executeOperation]
  );

  const deleteApplication = useCallback(
    async (applicationId: string) => {
      return executeOperation(
        () => tenantApi.deleteApplication(applicationId),
        {
          customErrorMessage: "Failed to delete application",
          onSuccess: () => {
            console.log("Application deleted successfully");
          },
        }
      );
    },
    [executeOperation]
  );

  const applyForProperty = useCallback(
    async (data: any) => {
      return executeOperation(() => tenantApi.applyForProperty(data), {
        customErrorMessage: "Failed to submit application",
        onSuccess: () => {
          console.log("Application submitted successfully");
        },
      });
    },
    [executeOperation]
  );

  const getLikedProperties = useCallback(async () => {
    return executeOperation(() => tenantApi.getLikedProperties(), {
      customErrorMessage: "Failed to load liked properties",
    });
  }, [executeOperation]);

  const likeProperty = useCallback(
    async (propertyId: string) => {
      return executeOperation(() => tenantApi.likeProperty(propertyId), {
        customErrorMessage: "Failed to like property",
        onSuccess: () => {
          console.log("Property liked successfully");
        },
      });
    },
    [executeOperation]
  );

  const unlikeProperty = useCallback(
    async (likeId: string) => {
      return executeOperation(() => tenantApi.unlikeProperty(likeId), {
        customErrorMessage: "Failed to unlike property",
        onSuccess: () => {
          console.log("Property unliked successfully");
        },
      });
    },
    [executeOperation]
  );

  const checkIfLiked = useCallback(
    async (propertyId: string) => {
      return executeOperation(() => tenantApi.checkIfLiked(propertyId), {
        customErrorMessage: "Failed to check like status",
      });
    },
    [executeOperation]
  );

  // Lease Operations
  const signLease = useCallback(
    async (leaseId: string, signature: string) => {
      return executeOperation(() => tenantApi.signLease(leaseId, signature), {
        customErrorMessage: "Failed to sign lease",
        onSuccess: () => {
          console.log("Lease signed successfully");
        },
      });
    },
    [executeOperation]
  );

  const getAllPendingLeases = useCallback(async () => {
    return executeOperation(() => tenantApi.getAllPendingLeases(), {
      customErrorMessage: "Failed to load pending leases",
    });
  }, [executeOperation]);

  const getAllLeases = useCallback(async () => {
    return executeOperation(() => tenantApi.getAllLeases(), {
      customErrorMessage: "Failed to load leases",
    });
  }, [executeOperation]);

  // Recommendation Operations
  const createRecommendation = useCallback(
    async (data: any) => {
      return submitForm(() => tenantApi.createRecommendation(data), {
        successMessage: "Recommendation created successfully!",
        onValidationError: (errors) => {
          console.log("Recommendation validation errors:", errors);
        },
      });
    },
    [submitForm]
  );

  const updateRecommendation = useCallback(
    async (recommendationId: string, data: any) => {
      return submitForm(
        () => tenantApi.updateRecommendation(recommendationId, data),
        {
          successMessage: "Recommendation updated successfully!",
        }
      );
    },
    [submitForm]
  );

  const getRecommendedProperties = useCallback(
    async (params?: { page?: number; per_page?: number }) => {
      return executeOperation(
        () => tenantApi.getRecommendedProperties(params),
        {
          customErrorMessage: "Failed to load recommended properties",
        }
      );
    },
    [executeOperation]
  );

  // Screening Operations
  const getAllScreenings = useCallback(async () => {
    return executeOperation(() => tenantApi.getAllScreenings(), {
      customErrorMessage: "Failed to load screenings",
    });
  }, [executeOperation]);

  const getScreeningDetails = useCallback(
    async (screeningId: string) => {
      return executeOperation(
        () => tenantApi.getScreeningDetails(screeningId),
        {
          customErrorMessage: "Failed to load screening details",
        }
      );
    },
    [executeOperation]
  );

  const getScreeningNotifications = useCallback(async () => {
    return executeOperation(() => tenantApi.getScreeningNotifications(), {
      customErrorMessage: "Failed to load screening notifications",
    });
  }, [executeOperation]);

  const updateScreening = useCallback(
    async (
      screeningId: string,
      data: {
        income?: number;
        employment_status?: string;
        previous_rental_history?: string;
        references?: string;
        additional_documents?: File[];
      }
    ) => {
      return executeOperation(
        () => tenantApi.updateScreening(screeningId, data),
        {
          customErrorMessage: "Failed to update screening",
          onSuccess: () => {
            console.log("Screening updated successfully");
          },
        }
      );
    },
    [executeOperation]
  );

  // Recent Activities
  const getRecentActivities = useCallback(
    async (params?: { limit?: number; days?: number }) => {
      return executeOperation(() => tenantApi.getRecentActivities(params), {
        customErrorMessage: "Failed to load recent activities",
      });
    },
    [executeOperation]
  );

  return {
    // Application operations
    getAllApplications,
    getApplication,
    applyForProperty,
    deleteApplication,

    // Property operations
    getLikedProperties,
    likeProperty,
    unlikeProperty,
    checkIfLiked,

    // Lease operations
    signLease,
    getAllPendingLeases,
    getAllLeases,

    // Recommendation operations
    createRecommendation,
    updateRecommendation,
    getRecommendedProperties,

    // Screening operations
    getAllScreenings,
    getScreeningDetails,
    getScreeningNotifications,
    updateScreening,

    // Recent Activities
    getRecentActivities,
  };
};

// ==============================================
// LEGACY EXPORTS FOR BACKWARD COMPATIBILITY
// ==============================================

export const getAllApplications = tenantApi.getAllApplications;
export const getApplication = tenantApi.getApplication;
export const deleteApplication = tenantApi.deleteApplication;

export const create_history = tenantApi.createHistory;
export const get_history = tenantApi.getHistory;
export const clear_history = tenantApi.clearHistory;
export const getAllTransactions = tenantApi.getAllTransactions;
export const getTransaction = tenantApi.getTransaction;

export const signLease = tenantApi.signLease;
export const getAllPendingLeases = tenantApi.getAllPendingLeases;
export const getAllLeases = tenantApi.getAllLeases;
export const applyForProperty = tenantApi.applyForProperty;
export const getLikedProperties = tenantApi.getLikedProperties;
export const likeProperty = tenantApi.likeProperty;
export const unlikeProperty = tenantApi.unlikeProperty;
export const checkIfLiked = tenantApi.checkIfLiked;
export const createRecommendation = tenantApi.createRecommendation;

export const updateRecommendation = tenantApi.updateRecommendation;
