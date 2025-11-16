import { useCallback } from "react";
import axiosInstance from "./axiosInstance";
import { useApiOperation, useFormSubmission } from "../hooks/useApiOperation";

// ==============================================
// API FUNCTIONS
// ==============================================

export const profileApi = {
  async getProfile() {
    const response = await axiosInstance.get("profile/");
    return response.data;
  },

  async updateProfile(userData: any) {
    const response = await axiosInstance.put("profile/", userData);
    return response.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await axiosInstance.put("profile/change-password", data);
    return response.data;
  },

  async uploadIdentityDocs(data: any) {
    const response = await axiosInstance.post(
      "profile/upload-identity-docs",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async uploadProfileImage(data: any) {
    const response = await axiosInstance.post(
      "profile/upload-profile-picture",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

// ==============================================
// REACT HOOKS FOR PROFILE OPERATIONS
// ==============================================

export const useProfileOperations = () => {
  const { executeOperation } = useApiOperation();
  const { submitForm } = useFormSubmission();

  const getProfile = useCallback(async () => {
    return executeOperation(() => profileApi.getProfile(), {
      customErrorMessage: "Failed to load profile",
    });
  }, [executeOperation]);

  const updateProfile = useCallback(
    async (userData: any) => {
      return submitForm(() => profileApi.updateProfile(userData), {
        successMessage: "Profile updated successfully!",
        onSuccess: (data) => {
          console.log("Profile updated:", data);
        },
        onValidationError: (errors) => {
          console.log("Profile update validation errors:", errors);
        },
      });
    },
    [submitForm]
  );

  const changePassword = useCallback(
    async (data: { currentPassword: string; newPassword: string }) => {
      return submitForm(() => profileApi.changePassword(data), {
        successMessage: "Password changed successfully!",
        onSuccess: () => {
          console.log("Password changed successfully");
        },
        onValidationError: (errors) => {
          console.log("Password change validation errors:", errors);
        },
      });
    },
    [submitForm]
  );

  const uploadIdentityDocs = useCallback(
    async (data: any) => {
      return executeOperation(() => profileApi.uploadIdentityDocs(data), {
        customErrorMessage: "Failed to upload identity documents",
        onSuccess: (data) => {
          console.log("Identity documents uploaded successfully:", data);
        },
      });
    },
    [executeOperation]
  );

  const uploadProfileImage = useCallback(
    async (data: any) => {
      return executeOperation(() => profileApi.uploadProfileImage(data), {
        customErrorMessage: "Failed to upload profile image",
        onSuccess: (data) => {
          console.log("Profile image uploaded successfully:", data);
        },
      });
    },
    [executeOperation]
  );

  return {
    getProfile,
    updateProfile,
    changePassword,
    uploadIdentityDocs,
    uploadProfileImage,
  };
};

// ==============================================
// LEGACY EXPORTS FOR BACKWARD COMPATIBILITY
// ==============================================

export const getProfileApi = profileApi.getProfile;
export const updateProfileApi = profileApi.updateProfile;
export const changePasswordApi = profileApi.changePassword;
export const uploadIdentityDocsApi = profileApi.uploadIdentityDocs;
export const uploadProfileImage = profileApi.uploadProfileImage;
