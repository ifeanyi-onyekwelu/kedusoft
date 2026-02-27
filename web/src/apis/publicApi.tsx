import { useCallback } from "react";
import axiosInstance from "./axiosInstance";
import { useApiOperation } from "../hooks/useApiOperation";

// ==============================================
// API FUNCTIONS
// ==============================================

export const publicApi = {
  async getAllCategories() {
    const response = await axiosInstance.get("/public/categories");
    return response.data;
  },

  async getAllProperties(
    params?: URLSearchParams | Record<string, any> | string
  ) {
    if (params instanceof URLSearchParams) {
      // Convert URLSearchParams to a regular object for axios
      const paramsObj: Record<string, any> = {};
      params.forEach((value, key) => {
        paramsObj[key] = value;
      });
      const response = await axiosInstance.get("/public/properties", {
        params: paramsObj,
      });
      return response.data;
    } else if (typeof params === "string") {
      // Handle string params directly in URL
      const response = await axiosInstance.get(`/public/properties?${params}`);
      return response.data;
    } else if (params && typeof params === "object") {
      // Handle regular object params
      const response = await axiosInstance.get("/public/properties", {
        params,
      });
      return response.data;
    } else {
      // No params
      const response = await axiosInstance.get("/public/properties");
      return response.data;
    }
  },

  async getPropertyById(id: string) {
    const response = await axiosInstance.get(`/public/properties/${id}`);
    return response.data;
  },

  async getFeaturedProperties() {
    const response = await axiosInstance.get("/public/properties/featured");
    return response.data;
  },

  async getLatestProperties() {
    const response = await axiosInstance.get("/public/properties/latest");
    return response.data;
  },

  async getNearbyProperties(
    latitude: number,
    longitude: number,
    radius_km: number = 10
  ) {
    const response = await axiosInstance.get("/public/properties/nearby", {
      params: {
        latitude,
        longitude,
        radius_km,
      },
    });
    return response.data;
  },

  async getCities() {
    const response = await axiosInstance.get("/public/cities");
    return response.data;
  },
};

// ==============================================
// REACT HOOKS FOR PUBLIC OPERATIONS
// ==============================================

export const usePublicOperations = () => {
  const { executeOperation } = useApiOperation();

  const getAllCategories = useCallback(async () => {
    return executeOperation(() => publicApi.getAllCategories(), {
      customErrorMessage: "Failed to load categories",
    });
  }, [executeOperation]);

  const getAllProperties = useCallback(
    async (params?: URLSearchParams | Record<string, any> | string) => {
      return executeOperation(() => publicApi.getAllProperties(params), {
        customErrorMessage: "Failed to load properties",
      });
    },
    [executeOperation]
  );

  const getPropertyById = useCallback(
    async (id: string) => {
      return executeOperation(() => publicApi.getPropertyById(id), {
        customErrorMessage: "Failed to load property details",
      });
    },
    [executeOperation]
  );

  const getFeaturedProperties = useCallback(async () => {
    return executeOperation(() => publicApi.getFeaturedProperties(), {
      customErrorMessage: "Failed to load featured properties",
    });
  }, [executeOperation]);

  const getLatestProperties = useCallback(async () => {
    return executeOperation(() => publicApi.getLatestProperties(), {
      customErrorMessage: "Failed to load latest properties",
    });
  }, [executeOperation]);

  const getNearbyProperties = useCallback(
    async (latitude: number, longitude: number, radius_km: number = 10) => {
      return executeOperation(
        () => publicApi.getNearbyProperties(latitude, longitude, radius_km),
        {
          customErrorMessage: "Failed to load nearby properties",
        }
      );
    },
    [executeOperation]
  );

  const getCities = useCallback(async () => {
    return executeOperation(() => publicApi.getCities(), {
      customErrorMessage: "Failed to load cities",
    });
  }, [executeOperation]);

  return {
    getAllCategories,
    getAllProperties,
    getPropertyById,
    getFeaturedProperties,
    getLatestProperties,
    getNearbyProperties,
    getCities,
  };
};

// ==============================================
// LEGACY EXPORTS FOR BACKWARD COMPATIBILITY
// ==============================================

export const getAllCategories = publicApi.getAllCategories;
export const getAllProperties = publicApi.getAllProperties;
export const getPropertyById = publicApi.getPropertyById;
export const getFeaturedProperties = publicApi.getFeaturedProperties;
export const getLatestProperties = publicApi.getLatestProperties;
export const getNearbyProperties = publicApi.getNearbyProperties;
export const getCities = publicApi.getCities;
