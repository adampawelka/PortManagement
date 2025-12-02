// src/services/api.js
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from 'react';

// API Base URLs from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const SCHEDULING_API_BASE_URL = import.meta.env.VITE_SCHEDULING_API_BASE_URL || "http://localhost:5107";

/**
 * Custom hook for making authenticated API calls
 * Follows industry best practices:
 * - Single responsibility: handles authentication automatically
 * - DRY: no code duplication
 * - Centralized error handling
 * - Type-safe and consistent
 */
export const useApi = () => {
    const { getAccessTokenSilently, logout } = useAuth0();

    /**
     * Creates an authenticated fetch function for a specific base URL
     * @param {string} baseUrl - The base URL for the API
     * @returns {Function} - Authenticated fetch function
     */
    const createAuthenticatedFetch = useCallback((baseUrl) => {
        return async (path, options = {}) => {
            try {
                const token = await getAccessTokenSilently();

                const response = await fetch(`${baseUrl}${path}`, {
                    ...options,
                    headers: {
                        "Content-Type": "application/json",
                        ...(options.headers || {}),
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    console.error("Unauthorized or forbidden request");
                    // Optionally: redirect to login or show error message
                }

                return response;
            } catch (err) {
                console.error("API request failed:", err);
                // If token retrieval fails, force logout
                if (err.message?.includes("token") || err.message?.includes("auth")) {
                    logout({ returnTo: window.location.origin });
                }
                throw err;
            }
        };
    }, [getAccessTokenSilently, logout]);

    // Pre-configured fetch functions for different APIs
    const apiFetch = useCallback(
        createAuthenticatedFetch(API_BASE_URL),
        [createAuthenticatedFetch]
    );

    const schedulingApiFetch = useCallback(
        createAuthenticatedFetch(SCHEDULING_API_BASE_URL),
        [createAuthenticatedFetch]
    );

    return { 
        apiFetch,           // For BackendAPI (port 5000)
        schedulingApiFetch  // For SchedulingAPI (port 5107)
    };
};