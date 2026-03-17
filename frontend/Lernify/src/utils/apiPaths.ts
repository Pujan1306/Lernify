export const API_URL = import.meta.env.VITE_API_URL;


export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        LOGOUT: "/api/auth/logout",
        ME: "/api/auth/session",
        UPDATE_PROFILE_IMAGE: "/api/auth/update-profile-image",
        UPDATE_THEME: "/api/auth/update-theme",
        GOOGLE: "/api/auth/google",
        GOOGLE_CALLBACK: "/api/auth/google/callback",
    },
    DOCUMENTS: {
        CREATE: "/api/document/upload",
        GET_ALL: "/api/document",
        GET_BY_ID: (id: string) => `/api/document/${id}`,
        UPDATE: (id: string) => `/api/document/${id}`,
        DELETE: (id: string) => `/api/document/${id}`,
    },
    FLASHCARDS: {
        GET_BY_DOCUMENT: (documentId: string) => `/api/flashcard/${documentId}`,
        GET_ALL: "/api/flashcard/all",
        REVIEW: (cardId: string) => `/api/flashcard/review/${cardId}`,
        TOGGLE_STAR: (cardId: string) => `/api/flashcard/toggle-star/${cardId}`,
        DELETE: (id: string) => `/api/flashcard/delete/${id}`,
    },
    AI: {
        GENERATE_FLASHCARDS: "/api/ai/generate-flashcards",
        GENERATE_QUIZ: "/api/ai/generate-quizzes",
        GENERATE_SUMMARY: "/api/ai/generate-summary",
        CHAT: "/api/ai/chat",
        EXPLAIN_CONCEPT: "/api/ai/explain-concept",
        CHAT_HISTORY: (documentId: string) => `/api/ai/chat-history/${documentId}`,
    },
    QUIZZES: {
        GET_BY_DOCUMENT: (documentId: string) => `/api/quizzes/${documentId}`,
        GET_BY_ID: (id: string) => `/api/quizzes/quiz/${id}`,
        SUBMIT: (id: string) => `/api/quizzes/${id}/submit`,
        GET_RESULTS: (id: string) => `/api/quizzes/${id}/results`,
        DELETE: (id: string) => `/api/quizzes/${id}`,
    },
    PROGRESS: {
        DASHBOARD: "/api/progress/dashboard",
    },
};
