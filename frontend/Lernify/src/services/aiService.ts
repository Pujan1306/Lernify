import axiosInstance from "../utils/axoisInstance";
import { API_PATHS } from "../utils/apiPaths";
import type { AxiosError } from "axios";
import type { ApiResponse } from "../types/ApiResponse";

const generateFlashcards = async (documentId: string, count: number = 10) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, { documentId, count });
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const generateQuiz = async (documentId: string, numQuestions: number = 5, title: string) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, { documentId, numQuestions, title });
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const generateSummary = async (documentId: string) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, { documentId });
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const chat = async (documentId: string, question: string) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.CHAT, { documentId, question });
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const explainConcept = async (documentId: string, concept: string) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, { documentId, concept });
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const getChatHistory = async (documentId: string) => {
    try {
        const response = await axiosInstance.get(API_PATHS.AI.CHAT_HISTORY(documentId));
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

export const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory,
};