import axiosInstance from "../utils/axoisInstance";
import { API_PATHS } from "../utils/apiPaths";
import type { AxiosError } from "axios";
import type { ApiResponse } from "../types/ApiResponse";

const getQuizzesByDocument = async (documentId: string) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_BY_DOCUMENT(documentId));
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const getQuizById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_BY_ID(id));
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const submitQuiz = async (id: string, answers: any) => {
    try {
        const response = await axiosInstance.post(API_PATHS.QUIZZES.SUBMIT(id), { answers });
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const getQuizResults = async (id: string) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_RESULTS(id));
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const deleteQuiz = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.QUIZZES.DELETE(id));
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

export const quizService = {
    getQuizzesByDocument,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz,
};