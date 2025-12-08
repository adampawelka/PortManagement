// src/services/api.js
import { useAuth0 } from "@auth0/auth0-react";
import React, { useCallback } from 'react';

const API_BASE_URL = "http://localhost:5000";

export const useApi = () => {
    // we obtein auth0 functions
    const { getAccessTokenSilently, logout } = useAuth0();

    // To reduce the fetch effect we use callBack
    const apiFetch = useCallback(async (path, options = {}) => {
        try {
            const token = await getAccessTokenSilently();

            const response = await fetch(`${API_BASE_URL}${path}`, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                    Authorization: `Bearer ${token}`,
                },
            });

            // Only consider 401/403 as logout-worthy
            if (response.status === 401 || response.status === 403) {
                console.error("Unauthorized or forbidden request. Logging out.");
                logout({ returnTo: window.location.origin });
            }

            return response;

        } catch (err) {
            // Network or backend errors should NOT log out the user
            console.error("API error (not auth related):", err);
            throw err; // propagate the error to the caller
        }
    }, [getAccessTokenSilently, logout]);


    return { apiFetch };
};