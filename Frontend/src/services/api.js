import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import { useNotification } from "../hooks/useNotification";
import { handleApiError } from "../utils/errorHandler";

export const useApi = (baseUrl = "http://localhost:5000") => {
    const { getAccessTokenSilently, logout } = useAuth0();
    const { showError } = useNotification();

    const apiFetch = useCallback(async (path, options = {}) => {
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

            // Handle auth errors (401/403) - logout but also show notification
            if (response.status === 401 || response.status === 403) {
                try {
                    const errorMessage = await handleApiError(response);
                    showError(errorMessage);
                } catch (error) {
                    showError("Unauthorized: Please log in again.");
                }
                console.error("Unauthorized or forbidden request. Logging out.");
                logout({ returnTo: window.location.origin });
                return response; // Return response so caller can handle it
            }

            // Handle other HTTP errors (4xx, 5xx) - show notification but don't logout
            if (!response.ok) {
                try {
                    const errorMessage = await handleApiError(response);
                    showError(errorMessage);
                } catch (error) {
                    showError(`Error ${response.status}: ${response.statusText || 'An error occurred'}`);
                }
                return response; // Return response so caller can still check response.ok
            }

            // Success case - return response as normal
            return response;
        } catch (err) {
            // Handle network errors and other exceptions
            try {
                const errorMessage = await handleApiError(err);
                showError(errorMessage);
            } catch (error) {
                showError("An unexpected error occurred. Please try again.");
            }
            console.error("API error:", err);
            throw err; // Re-throw so caller can handle if needed
        }
    }, [getAccessTokenSilently, logout, baseUrl, showError]);

    return { apiFetch };
};
