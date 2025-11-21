// src/services/api.js
import { useAuth0 } from "@auth0/auth0-react";

const API_BASE_URL = "http://localhost:5000";

export const useApi = () => {
    const { getAccessTokenSilently, logout } = useAuth0();

    const apiFetch = async (path, options = {}) => {
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

            if (response.status === 401 || response.status === 403) {
                console.error("Unauthorized or forbidden request");
            }

            return response;
        } catch (err) {

            console.error("Token error:", err);
            logout({ returnTo: window.location.origin });
            throw err;
        }
    };

    return { apiFetch };
};