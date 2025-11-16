import { useCallback } from "react";
import axiosInstance from "./axiosInstance";
import {
  useApiOperation,
  useFormSubmission,
  usePaginatedApi,
} from "../hooks/useApiOperation";

// ==============================================
// API FUNCTIONS
// ==============================================

export const landlordApi = {
  // Property Management
  async createProperty(propertyData: any) {
    const response = await axiosInstance.post(
      "/property-owner/properties",
      propertyData
    );
    return response;
  },

  async savePropertyDraft(draftData: any) {
    const response = await axiosInstance.post(
      "/property-owner/properties/drafts",
      draftData
    );
    return response;
  },

  async getPropertyDrafts() {
    const response = await axiosInstance.get(
      "/property-owner/properties/drafts"
    );
    return response.data;
  },

  async getPropertyDraft(draftId: string) {
    const response = await axiosInstance.get(
      `/property-owner/properties/drafts/${draftId}`
    );
    return response.data;
  },

  async deletePropertyDraft(draftId: string) {
    const response = await axiosInstance.delete(
      `/property-owner/properties/drafts/${draftId}`
    );
    return response.data;
  },

  async publishPropertyDraft(draftId: string) {
    const response = await axiosInstance.post(
      `/property-owner/properties/drafts/${draftId}/publish`
    );
    return response.data;
  },

  async getListedProperties() {
    const response = await axiosInstance.get("/property-owner/properties");
    return response.data;
  },

  async getPropertiesPerformance() {
    const response = await axiosInstance.get(
      "/property-owner/properties/performance"
    );
    return response.data;
  },

  async getProperty(propertyId: string) {
    const response = await axiosInstance.get(
      `/property-owner/properties/${propertyId}`
    );
    return response.data;
  },

  async updateProperty(propertyId: string, updateData: any) {
    const response = await axiosInstance.put(
      `/property-owner/properties/${propertyId}`,
      updateData
    );
    return response;
  },

  async deleteProperty(propertyId: string) {
    const response = await axiosInstance.delete(
      `/property-owner/properties/${propertyId}`
    );
    return response;
  },

  // Application Management
  async getAllApplications(params: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const response = await axiosInstance.get("/property-owner/applications", {
      params,
    });
    return response.data;
  },

  async getApplication(propertyId: string, applicationId: string) {
    const response = await axiosInstance.get(
      `/property-owner/applications/${applicationId}/${propertyId}`
    );
    return response.data;
  },

  async getApplicationById(applicationId: string, propertyId: string) {
    const response = await axiosInstance.get(
      `/property-owner/applications/${applicationId}/${propertyId}`
    );
    return response.data;
  },

  async rejectApplication(applicationId: string) {
    const response = await axiosInstance.patch(
      `/property-owner/applications/${applicationId}/reject`
    );
    return response.data;
  },

  async getApplicants() {
    const response = await axiosInstance.get(
      "/property-owner/applications/applicants"
    );
    return response.data;
  },

  async getApplicant(applicant_id: string) {
    const response = await axiosInstance.get(
      `/property-owner/applications/applicants/${applicant_id}`
    );
    return response.data;
  },

  // Screening Management
  async createScreening(applicationId: string, screeningData: any) {
    const response = await axiosInstance.post(
      `/property-owner/applications/${applicationId}/screenings`,
      screeningData
    );
    return response.data;
  },

  async completeScreening(screeningId: string, status: string) {
    const response = await axiosInstance.patch(
      `/property-owner/screenings/${screeningId}/complete`,
      { status }
    );
    return response.data;
  },

  // Lease Management
  async createLease(applicationId: string, leaseData: any) {
    const response = await axiosInstance.post(
      `/property-owner/applications/${applicationId}/leases`,
      leaseData
    );
    return response.data;
  },

  async signLeaseAsLandlord(leaseId: string, signature: string) {
    const response = await axiosInstance.post(
      `/property-owner/leases/${leaseId}/sign`,
      { signature }
    );
    return response.data;
  },

  async terminateLease(leaseId: string) {
    const response = await axiosInstance.post(
      `/property-owner/leases/${leaseId}/terminate`
    );
    return response.data;
  },

  async getAllLeases() {
    const response = await axiosInstance.get("/property-owner/leases");
    return response.data;
  },

  // Tenant Management
  async getTenants(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }) {
    const response = await axiosInstance.get("/property-owner/tenants", {
      params,
    });
    return response.data;
  },

  async getTenantStats() {
    const response = await axiosInstance.get("/property-owner/tenants/stats");
    return response.data;
  },

  async getTenantById(tenantId: string) {
    const response = await axiosInstance.get(
      `/property-owner/tenants/${tenantId}`
    );
    return response.data;
  },

  async getPropertyTenant(propertyId: string) {
    const response = await axiosInstance.get(
      `/property-owner/properties/${propertyId}/tenant`
    );
    return response.data;
  },

  // Transaction Management
  async getAllTransactions() {
    const response = await axiosInstance.get("/property-owner/transactions");
    return response.data;
  },

  async getTransactionStatistics(params?: {
    date_range?: "today" | "week" | "month" | "year" | "custom";
    start_date?: string;
    end_date?: string;
    compare?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.date_range) queryParams.append("date_range", params.date_range);
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.compare !== undefined)
      queryParams.append("compare", params.compare.toString());

    const response = await axiosInstance.get(
      `/property-owner/transactions/statistics?${queryParams.toString()}`
    );
    return response.data;
  },

  async getFinancialOverview() {
    const response = await axiosInstance.get(
      "/property-owner/financial-overview"
    );
    return response.data;
  },

  async getAlerts() {
    const response = await axiosInstance.get("/property-owner/alerts");
    return response.data;
  },

  async getOccupancyStats() {
    const response = await axiosInstance.get("/property-owner/occupancy-stats");
    return response.data;
  },

  async getTenantSummary() {
    const response = await axiosInstance.get("/property-owner/tenant-summary");
    return response.data;
  },

  async getRevenueChart() {
    const response = await axiosInstance.get("/property-owner/revenue-chart");
    return response.data;
  },

  async getApplicationStats(params?: {
    date_range?: "today" | "week" | "month" | "year" | "custom";
    start_date?: string;
    end_date?: string;
    compare?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.date_range) queryParams.append("date_range", params.date_range);
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.compare !== undefined)
      queryParams.append("compare", params.compare.toString());

    const response = await axiosInstance.get(
      `/property-owner/applications/stats?${queryParams.toString()}`
    );
    return response.data;
  },

  async getPropertyViewsStatistics(params?: {
    date_range?: "today" | "week" | "month" | "year" | "custom";
    start_date?: string;
    end_date?: string;
    compare?: boolean;
    property_id?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.date_range) queryParams.append("date_range", params.date_range);
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.compare !== undefined)
      queryParams.append("compare", params.compare.toString());
    if (params?.property_id)
      queryParams.append("property_id", params.property_id);

    const response = await axiosInstance.get(
      `/property-owner/properties/views/statistics?${queryParams.toString()}`
    );
    console.log("Property View Statistics Response", response);
    return response.data;
  },

  async getPropertiesLikedByTenants(params?: {
    date_range?: "today" | "week" | "month" | "year" | "custom";
    start_date?: string;
    end_date?: string;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.date_range) queryParams.append("date_range", params.date_range);
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await axiosInstance.get(
      `/property-owner/properties/liked?${queryParams.toString()}`
    );
    return response.data;
  },

  async getTransaction(propertyId: string, transactionId: string) {
    const response = await axiosInstance.get(
      `/property-owner/transactions/${transactionId}/${propertyId}`
    );
    return response.data;
  },

  // Application Management Enhancement
  async approveApplication(applicationId: string, data?: { notes?: string }) {
    const response = await axiosInstance.patch(
      `/property-owner/applications/${applicationId}/approve`,
      data || {}
    );
    return response.data;
  },

  // Screening Management
  async getAllScreenings() {
    const response = await axiosInstance.get("/property-owner/screenings");
    return response.data;
  },

  async getScreeningDetails(screeningId: string) {
    const response = await axiosInstance.get(
      `/property-owner/screenings/${screeningId}`
    );
    return response.data;
  },

  async reviewScreening(
    screeningId: string,
    data: {
      result: "approved" | "rejected";
      notes?: string;
    }
  ) {
    const response = await axiosInstance.patch(
      `/property-owner/screenings/${screeningId}/review`,
      data
    );
    return response.data;
  },

  // Recent Activities
  async getRecentActivities(params?: { limit?: number; days?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.days) queryParams.append("days", params.days.toString());

    const response = await axiosInstance.get(
      `property-owner/activities/recent?${queryParams}`
    );
    return response.data;
  },
};

// ==============================================
// REACT HOOKS FOR LANDLORD OPERATIONS
// ==============================================

export const useLandlordOperations = () => {
  const { executeOperation } = useApiOperation();
  const { submitForm } = useFormSubmission();

  // Property Operations
  const createProperty = useCallback(
    async (propertyData: any) => {
      return submitForm(() => landlordApi.createProperty(propertyData), {
        successMessage: "Property created successfully!",
        onSuccess: (data) => {
          console.log("Property created:", data);
        },
        onValidationError: (errors) => {
          console.log("Property creation validation errors:", errors);
        },
      });
    },
    [submitForm]
  );

  const savePropertyDraft = useCallback(
    async (draftData: any) => {
      return executeOperation(() => landlordApi.savePropertyDraft(draftData), {
        customErrorMessage: "Failed to save property draft",
        onSuccess: (data) => {
          console.log("Property draft saved:", data);
        },
      });
    },
    [executeOperation]
  );

  const getPropertyDrafts = useCallback(async () => {
    return executeOperation(() => landlordApi.getPropertyDrafts(), {
      customErrorMessage: "Failed to load property drafts",
    });
  }, [executeOperation]);

  const getPropertyDraft = useCallback(
    async (draftId: string) => {
      return executeOperation(() => landlordApi.getPropertyDraft(draftId), {
        customErrorMessage: "Failed to load property draft",
      });
    },
    [executeOperation]
  );

  const deletePropertyDraft = useCallback(
    async (draftId: string) => {
      return executeOperation(() => landlordApi.deletePropertyDraft(draftId), {
        customErrorMessage: "Failed to delete property draft",
        onSuccess: () => {
          console.log("Property draft deleted successfully");
        },
      });
    },
    [executeOperation]
  );

  const publishPropertyDraft = useCallback(
    async (draftId: string) => {
      return executeOperation(() => landlordApi.publishPropertyDraft(draftId), {
        customErrorMessage: "Failed to publish property draft",
        onSuccess: () => {
          console.log("Property draft published successfully");
        },
      });
    },
    [executeOperation]
  );

  const getListedProperties = useCallback(async () => {
    return executeOperation(() => landlordApi.getListedProperties(), {
      customErrorMessage: "Failed to load properties",
    });
  }, [executeOperation]);

  const getPropertiesPerformance = useCallback(async () => {
    return executeOperation(() => landlordApi.getPropertiesPerformance(), {
      customErrorMessage: "Failed to load property performance data",
    });
  }, [executeOperation]);

  const getProperty = useCallback(
    async (propertyId: string) => {
      return executeOperation(() => landlordApi.getProperty(propertyId), {
        customErrorMessage: "Failed to load property details",
      });
    },
    [executeOperation]
  );

  const updateProperty = useCallback(
    async (propertyId: string, updateData: any) => {
      return submitForm(
        () => landlordApi.updateProperty(propertyId, updateData),
        {
          successMessage: "Property updated successfully!",
          onSuccess: (data) => {
            console.log("Property updated:", data);
          },
        }
      );
    },
    [submitForm]
  );

  const deleteProperty = useCallback(
    async (propertyId: string) => {
      return executeOperation(() => landlordApi.deleteProperty(propertyId), {
        customErrorMessage: "Failed to delete property",
        onSuccess: () => {
          console.log("Property deleted successfully");
        },
      });
    },
    [executeOperation]
  );

  // Application Operations
  const getAllApplications = useCallback(
    async (params: { page?: number; limit?: number; status?: string } = {}) => {
      return executeOperation(() => landlordApi.getAllApplications(params), {
        customErrorMessage: "Failed to load applications",
      });
    },
    [executeOperation]
  );

  const getApplication = useCallback(
    async (propertyId: string, applicationId: string) => {
      return executeOperation(
        () => landlordApi.getApplication(propertyId, applicationId),
        {
          customErrorMessage: "Failed to load application details",
        }
      );
    },
    [executeOperation]
  );

  const getApplicationById = useCallback(
    async (applicationId: string, propertyId: string) => {
      return executeOperation(
        () => landlordApi.getApplicationById(applicationId, propertyId),
        {
          customErrorMessage: "Failed to load application details",
        }
      );
    },
    [executeOperation]
  );

  const rejectApplication = useCallback(
    async (applicationId: string) => {
      return executeOperation(
        () => landlordApi.rejectApplication(applicationId),
        {
          customErrorMessage: "Failed to reject application",
          onSuccess: () => {
            console.log("Application rejected successfully");
          },
        }
      );
    },
    [executeOperation]
  );

  // Note: updateApplicationStatus removed - endpoint doesn't exist in backend
  // Application status changes through screening process

  const getApplicants = useCallback(async () => {
    return executeOperation(() => landlordApi.getApplicants(), {
      customErrorMessage: "Failed to load applicants",
    });
  }, [executeOperation]);

  const getApplicant = useCallback(
    async (applicant_id: string) => {
      return executeOperation(() => landlordApi.getApplicant(applicant_id), {
        customErrorMessage: "Failed to load applicant details",
      });
    },
    [executeOperation]
  );

  const getApplicationStats = useCallback(
    async (params?: {
      date_range?: "today" | "week" | "month" | "year" | "custom";
      start_date?: string;
      end_date?: string;
      compare?: boolean;
    }) => {
      return executeOperation(() => landlordApi.getApplicationStats(params), {
        customErrorMessage: "Failed to load application statistics",
      });
    },
    [executeOperation]
  );

  const approveApplication = useCallback(
    async (applicationId: string, data?: { notes?: string }) => {
      return executeOperation(
        () => landlordApi.approveApplication(applicationId, data),
        {
          customErrorMessage: "Failed to approve application",
          onSuccess: () => {
            console.log("Application approved successfully");
          },
        }
      );
    },
    [executeOperation]
  );

  const getPropertyViewsStatistics = useCallback(
    async (params?: {
      date_range?: "today" | "week" | "month" | "year" | "custom";
      start_date?: string;
      end_date?: string;
      compare?: boolean;
      property_id?: string;
    }) => {
      return executeOperation(
        () => landlordApi.getPropertyViewsStatistics(params),
        {
          customErrorMessage: "Failed to load property views statistics",
        }
      );
    },
    [executeOperation]
  );

  const getPropertiesLikedByTenants = useCallback(
    async (params?: {
      date_range?: "today" | "week" | "month" | "year" | "custom";
      start_date?: string;
      end_date?: string;
      limit?: number;
    }) => {
      return executeOperation(
        () => landlordApi.getPropertiesLikedByTenants(params),
        {
          customErrorMessage: "Failed to load liked properties",
        }
      );
    },
    [executeOperation]
  );

  // Screening Operations
  const createScreening = useCallback(
    async (applicationId: string, screeningData: any) => {
      return submitForm(
        () => landlordApi.createScreening(applicationId, screeningData),
        {
          successMessage: "Screening created successfully!",
          onSuccess: (data) => {
            console.log("Screening created:", data);
          },
        }
      );
    },
    [submitForm]
  );

  const getAllScreenings = useCallback(async () => {
    return executeOperation(() => landlordApi.getAllScreenings(), {
      customErrorMessage: "Failed to load screenings",
    });
  }, [executeOperation]);

  const getScreeningDetails = useCallback(
    async (screeningId: string) => {
      return executeOperation(
        () => landlordApi.getScreeningDetails(screeningId),
        {
          customErrorMessage: "Failed to load screening details",
        }
      );
    },
    [executeOperation]
  );

  const reviewScreening = useCallback(
    async (
      screeningId: string,
      data: {
        result: "approved" | "rejected";
        notes?: string;
      }
    ) => {
      return executeOperation(
        () => landlordApi.reviewScreening(screeningId, data),
        {
          customErrorMessage: "Failed to review screening",
          onSuccess: () => {
            console.log("Screening reviewed successfully");
          },
        }
      );
    },
    [executeOperation]
  );

  const completeScreening = useCallback(
    async (screeningId: string, status: string) => {
      return executeOperation(
        () => landlordApi.completeScreening(screeningId, status),
        {
          customErrorMessage: "Failed to complete screening",
          onSuccess: () => {
            console.log("Screening completed successfully");
          },
        }
      );
    },
    [executeOperation]
  );

  // Lease Operations
  const createLease = useCallback(
    async (applicationId: string, leaseData: any) => {
      return submitForm(
        () => landlordApi.createLease(applicationId, leaseData),
        {
          successMessage: "Lease created successfully!",
          onSuccess: (data) => {
            console.log("Lease created:", data);
          },
        }
      );
    },
    [submitForm]
  );

  const signLeaseAsLandlord = useCallback(
    async (leaseId: string, signature: string) => {
      return executeOperation(
        () => landlordApi.signLeaseAsLandlord(leaseId, signature),
        {
          customErrorMessage: "Failed to sign lease",
          onSuccess: () => {
            console.log("Lease signed successfully");
          },
        }
      );
    },
    [executeOperation]
  );

  const terminateLease = useCallback(
    async (leaseId: string) => {
      return executeOperation(() => landlordApi.terminateLease(leaseId), {
        customErrorMessage: "Failed to terminate lease",
        onSuccess: () => {
          console.log("Lease terminated successfully");
        },
      });
    },
    [executeOperation]
  );

  const getAllLeases = useCallback(async () => {
    return executeOperation(() => landlordApi.getAllLeases(), {
      customErrorMessage: "Failed to load leases",
    });
  }, [executeOperation]);

  // Tenant Operations
  const getTenants = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      start_date?: string;
      end_date?: string;
    }) => {
      return executeOperation(() => landlordApi.getTenants(params), {
        customErrorMessage: "Failed to load tenants",
      });
    },
    [executeOperation]
  );

  const getTenantStats = useCallback(async () => {
    return executeOperation(() => landlordApi.getTenantStats(), {
      customErrorMessage: "Failed to load tenant statistics",
    });
  }, [executeOperation]);

  const getTenantById = useCallback(
    async (tenantId: string) => {
      return executeOperation(() => landlordApi.getTenantById(tenantId), {
        customErrorMessage: "Failed to load tenant details",
      });
    },
    [executeOperation]
  );

  const getPropertyTenant = useCallback(
    async (propertyId: string) => {
      return executeOperation(() => landlordApi.getPropertyTenant(propertyId), {
        customErrorMessage: "Failed to load property tenant",
      });
    },
    [executeOperation]
  );

  // Transaction Operations
  const getAllTransactions = useCallback(async () => {
    return executeOperation(() => landlordApi.getAllTransactions(), {
      customErrorMessage: "Failed to load transactions",
    });
  }, [executeOperation]);

  const getTransactionStatistics = useCallback(
    async (params?: {
      date_range?: "today" | "week" | "month" | "year" | "custom";
      start_date?: string;
      end_date?: string;
      compare?: boolean;
    }) => {
      return executeOperation(
        () => landlordApi.getTransactionStatistics(params),
        {
          customErrorMessage: "Failed to load transaction statistics",
        }
      );
    },
    [executeOperation]
  );

  const getFinancialOverview = useCallback(async () => {
    return executeOperation(() => landlordApi.getFinancialOverview(), {
      customErrorMessage: "Failed to load financial overview",
    });
  }, [executeOperation]);

  const getAlerts = useCallback(async () => {
    return executeOperation(() => landlordApi.getAlerts(), {
      customErrorMessage: "Failed to load alerts",
    });
  }, [executeOperation]);

  const getOccupancyStats = useCallback(async () => {
    return executeOperation(() => landlordApi.getOccupancyStats(), {
      customErrorMessage: "Failed to load occupancy statistics",
    });
  }, [executeOperation]);

  const getTenantSummary = useCallback(async () => {
    return executeOperation(() => landlordApi.getTenantSummary(), {
      customErrorMessage: "Failed to load tenant summary",
    });
  }, [executeOperation]);

  const getRevenueChart = useCallback(async () => {
    return executeOperation(() => landlordApi.getRevenueChart(), {
      customErrorMessage: "Failed to load revenue chart data",
    });
  }, [executeOperation]);

  const getTransaction = useCallback(
    async (propertyId: string, transactionId: string) => {
      return executeOperation(
        () => landlordApi.getTransaction(propertyId, transactionId),
        {
          customErrorMessage: "Failed to load transaction details",
        }
      );
    },
    [executeOperation]
  );

  // Recent Activities
  const getRecentActivities = useCallback(
    async (params?: { limit?: number; days?: number }) => {
      return executeOperation(() => landlordApi.getRecentActivities(params), {
        customErrorMessage: "Failed to load recent activities",
      });
    },
    [executeOperation]
  );

  return {
    // Property operations
    createProperty,
    savePropertyDraft,
    getPropertyDrafts,
    getPropertyDraft,
    deletePropertyDraft,
    publishPropertyDraft,
    getListedProperties,
    getPropertiesPerformance,
    getProperty,
    updateProperty,
    deleteProperty,

    // Application operations
    getAllApplications,
    getApplication,
    getApplicationById,
    rejectApplication,
    approveApplication,
    getApplicants,
    getApplicant,
    getApplicationStats,

    // Screening operations
    createScreening,
    getAllScreenings,
    getScreeningDetails,
    reviewScreening,
    completeScreening,

    // Lease operations
    createLease,
    signLeaseAsLandlord,
    terminateLease,
    getAllLeases,

    // Tenant operations
    getTenants,
    getTenantStats,
    getTenantById,
    getPropertyTenant,

    // Transaction operations
    getAllTransactions,
    getTransactionStatistics,
    getFinancialOverview,
    getTransaction,
    getPropertiesLikedByTenants,
    getPropertyViewsStatistics,

    // Recent Activities
    getRecentActivities,

    // Alerts & Notifications
    getAlerts,

    // Dashboard Statistics
    getOccupancyStats,
    getTenantSummary,
    getRevenueChart,
  };
};

// ==============================================
// LEGACY EXPORTS FOR BACKWARD COMPATIBILITY
// ==============================================

export const createProperty = landlordApi.createProperty;
export const savePropertyDraft = landlordApi.savePropertyDraft;
export const getPropertyDrafts = landlordApi.getPropertyDrafts;
export const getPropertyDraft = landlordApi.getPropertyDraft;
export const deletePropertyDraft = landlordApi.deletePropertyDraft;
export const publishPropertyDraft = landlordApi.publishPropertyDraft;
export const getListedProperties = landlordApi.getListedProperties;
export const getPropertiesPerformance = landlordApi.getPropertiesPerformance;
export const getProperty = landlordApi.getProperty;
export const updateProperty = landlordApi.updateProperty;
export const deleteProperty = landlordApi.deleteProperty;
export const getAllApplications = landlordApi.getAllApplications;
export const getApplication = landlordApi.getApplication;
export const getApplicants = landlordApi.getApplicants;
export const getApplicant = landlordApi.getApplicant;
export const getApplicationStats = landlordApi.getApplicationStats;
export const createScreening = landlordApi.createScreening;
export const completeScreening = landlordApi.completeScreening;
export const createLease = landlordApi.createLease;
export const signLeaseAsLandlord = landlordApi.signLeaseAsLandlord;
export const terminateLease = landlordApi.terminateLease;
export const getTenants = landlordApi.getTenants;
export const getTenantById = landlordApi.getTenantById;
export const getPropertyTenant = landlordApi.getPropertyTenant;
export const getAllTransactions = landlordApi.getAllTransactions;
export const getTransactionStatistics = landlordApi.getTransactionStatistics;
export const getTransaction = landlordApi.getTransaction;
export const getPropertiesLikedByTenants =
  landlordApi.getPropertiesLikedByTenants;
