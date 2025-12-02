// src/services/api.js
import { useAuth0 } from "@auth0/auth0-react";
import React, { useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const useApi = () => {
    // we obtein auth0 functions
    const { getAccessTokenSilently, logout } = useAuth0();

    // To reduce the fecth effect we use callBack
    const apiFetch = useCallback(async (path, options = {}) => {
        try {
            const token = await getAccessTokenSilently();

            const response = await fetch(`${API_BASE_URL}${path}`, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                    // Put here the token
                    Authorization: `Bearer ${token}`, 
                },
            });

            if (response.status === 401 || response.status === 403) {
                console.error("Unauthorized or forbidden request");
            }

            return response;
        } catch (err) {
            // if Token obtain function fails, we force the logout
            console.error("Token error:", err);
            logout({ returnTo: window.location.origin });
            throw err;
        }
    }, [getAccessTokenSilently, logout]); 
    
    return { apiFetch };
};