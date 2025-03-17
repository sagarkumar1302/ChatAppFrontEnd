import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" 
        ? "http://localhost:5000/api" 
        : "https://chatappbackend-production-6b03.up.railway.app/api",
    withCredentials: true,  // Allows sending cookies for session-based authentication
});

// Automatically attach the token to every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken"); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
