import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

export const useApi = (baseUrl = "http://localhost:5000") => {
    const { getAccessTokenSilently, logout } = useAuth0();

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

            if (response.status === 401 || response.status === 403) {
                console.error("Unauthorized or forbidden request. Logging out.");
                logout({ returnTo: window.location.origin });
            }

            return response;
        } catch (err) {
            console.error("API error (not auth related):", err);
            throw err;
        }
    }, [getAccessTokenSilently, logout, baseUrl]);

    return { apiFetch };
};
