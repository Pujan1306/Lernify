import axios from "axios"
import { API_URL } from "./apiPaths"

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 80000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Only handle 401 as authentication error
                console.error("Authentication error:", error.response.data)
                // Let the AuthContext handle the logout
                return Promise.reject(error)
            } else if (error.response.status === 500) {
                // Show error message
                console.error("Server error:", error.response.data)
            } else if (error.code === "ECONNABORTED") {
                // Show error message
                console.error("Request timeout. Please try again.")
            }
        }
        return Promise.reject(error)
    }
)

export default axiosInstance