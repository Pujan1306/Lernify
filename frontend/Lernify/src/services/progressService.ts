import axiosInstance from "../utils/axoisInstance";
import { API_PATHS } from "../utils/apiPaths";
import type { AxiosError } from "axios";
import type { ApiResponse } from "../types/ApiResponse";

const getDashboardProgress = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.PROGRESS.DASHBOARD);
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

export const progressService = {
    getDashboardProgress,
};