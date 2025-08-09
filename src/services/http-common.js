// src/services/http-common.js

import axios from "axios";
import AuthService from "./auth.service";

// Create an Axios instance with a base URL.
const instance = axios.create({
    baseURL: "http://localhost:8080/api/v1/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor: Automatically adds the JWT to every outgoing request.
instance.interceptors.request.use(
    (config) => {
        const user = AuthService.getCurrentUser();

        // The user object is correctly checked for the 'token' property.
        if (user && user.token) {
            config.headers["Authorization"] = 'Bearer ' + user.token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;