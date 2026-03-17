import axiosInstance from "../utils/axoisInstance";
import { API_PATHS, API_URL } from "../utils/apiPaths";
import type { AxiosError } from "axios";
import type { ApiResponse } from "../types/ApiResponse";

const login = async (email: string, password: string) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const register = async (username: string, email: string, password: string) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, { username, email, password });
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const getProfile = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.AUTH.ME);
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const updateProfile = async (imageFile: File) => {
    try {
        const formData = new FormData();
        formData.append('profileImage', imageFile);
        
        const response = await axiosInstance.put(
            API_PATHS.AUTH.UPDATE_PROFILE_IMAGE, 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "Failed to update profile image");
    }
};

const updateTheme = async (theme: string) => {
    try {
        const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_THEME, { theme });
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "Failed to update theme");
    }
};

const googleAuth = () => {
  return new Promise<void>((resolve, reject) => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      `${API_URL}/api/auth/google`,
      "googleAuth",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,popup=yes`
    );

    if (!popup) {
      reject(new Error("Popup blocked! Please allow popups for this site."));
      return;
    }

    const cleanup = () => {
      window.removeEventListener("message", messageListener);
      if (authTimeout) window.clearTimeout(authTimeout);
    };

    const messageListener = (event: MessageEvent) => {
      if (event.source !== popup) return;
      if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
        cleanup();
        resolve();
      }
      if (event.data?.type === "GOOGLE_AUTH_ERROR") {
        cleanup();
        reject(new Error(event.data?.error || "Google auth failed"));
      }
    };
    window.addEventListener("message", messageListener);

    const authTimeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Google auth timed out"));
    }, 2 * 60 * 1000);
  });
};

const logout = async () => {
    try {
        await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
        localStorage.removeItem("token");
    } catch (error: any) {
        localStorage.removeItem("token");
        const errorMessage = error.response?.data?.message || error.message || "Logout failed";
         throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    } 
};

export const authService = {
    login,
    register,
    getProfile,
    updateProfile,
    updateTheme,
    googleAuth,
    logout
};