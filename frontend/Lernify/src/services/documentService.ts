import axiosInstance from "../utils/axoisInstance";
import { API_PATHS } from "../utils/apiPaths";
import type { AxiosError } from "axios";
import type { ApiResponse } from "../types/ApiResponse";

const getDocuments = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_ALL);
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const createDocument = async (file: File, title: string) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        
        const response = await axiosInstance.post(API_PATHS.DOCUMENTS.CREATE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const getDocumentById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_BY_ID(id));
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const updateDocumentById = async (id: string, title: string) => {
    try {
        const response = await axiosInstance.put(API_PATHS.DOCUMENTS.UPDATE(id), { title });
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

const deleteDocumentById = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE(id));
        return response.data;
    } catch (error) {
        const errorMessage = error as AxiosError<ApiResponse>
        throw new Error(errorMessage.response?.data?.message || "An unknown error occurred");
    }
};

export const documentService = {
    getDocuments,
    createDocument,
    getDocumentById,
    updateDocumentById,
    deleteDocumentById,
};