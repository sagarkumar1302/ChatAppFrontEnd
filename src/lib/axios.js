import axios from "axios";
export const axiosInstance = axios.create({
    baseURL: import.meta.env==="development"? "http://localhost:5000/api": "https://chatappbackend-production-6b03.up.railway.app/api",
    withCredentials: true,
}); 