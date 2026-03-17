import axiosInstance from "../utils/axoisInstance";
import { API_PATHS } from "../utils/apiPaths";
import type { AxiosError } from "axios";
import type { ApiResponse } from "../types/ApiResponse";

const getFlashcards = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL);
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const getFlashcardsByDocument = async (documentId: string) => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_BY_DOCUMENT(documentId));
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const reviewFlashcard = async (cardId: string) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW(cardId));
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const toggleStar = async (cardId: string) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const deleteFlashcard = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE(id));
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

export const flashcardService = {
    getFlashcards,
    getFlashcardsByDocument,
    reviewFlashcard,
    toggleStar,
    deleteFlashcard,
};