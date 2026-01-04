"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VvnClientService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
class VvnClientService {
    constructor() {
        this.baseUrl = config_1.default.backendApiUrl;
        this.client = axios_1.default.create({
            baseURL: this.baseUrl,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    /**
     * Check if a VVN exists by ID
     * @param vvnId - The VVN ID (UUID string)
     * @returns true if VVN exists, false otherwise
     */
    async vvnExists(vvnId) {
        try {
            console.log(`[VvnClientService] Checking if VVN exists: ${vvnId}`);
            console.log(`[VvnClientService] Backend API URL: ${this.baseUrl}`);
            const response = await this.client.get(`/VesselVisitNotifications/${vvnId}`);
            console.log(`[VvnClientService] VVN check response status: ${response.status}`);
            return response.status === 200 && response.data !== null;
        }
        catch (error) {
            console.error(`[VvnClientService] Error checking VVN existence:`, error.message);
            if (error.response) {
                console.error(`[VvnClientService] Response status: ${error.response.status}`);
                console.error(`[VvnClientService] Response data:`, error.response.data);
            }
            if (error.response && error.response.status === 404) {
                return false;
            }
            // For other errors (network, timeout, etc.), throw to let caller handle
            throw new Error(`Failed to validate VVN existence: ${error.message}`);
        }
    }
    /**
     * Get VVN by ID
     * @param vvnId - The VVN ID (UUID string)
     * @returns VVN DTO if exists, null otherwise
     */
    async getVvnById(vvnId) {
        try {
            console.log(`[VvnClientService] Fetching VVN: ${vvnId} from ${this.baseUrl}/VesselVisitNotifications/${vvnId}`);
            const response = await this.client.get(`/VesselVisitNotifications/${vvnId}`);
            if (response.status === 200 && response.data) {
                console.log(`[VvnClientService] VVN response data:`, JSON.stringify(response.data, null, 2));
                // Map visitStatus to status if needed (Backend API might use visitStatus)
                const vvnData = response.data;
                if (vvnData.visitStatus && !vvnData.status) {
                    vvnData.status = vvnData.visitStatus;
                }
                return vvnData;
            }
            return null;
        }
        catch (error) {
            console.error(`[VvnClientService] Error fetching VVN:`, error.message);
            if (error.response) {
                console.error(`[VvnClientService] Response status: ${error.response.status}`);
                console.error(`[VvnClientService] Response data:`, error.response.data);
                // Include status code in error message for better error handling
                if (error.response.status === 401) {
                    throw new Error(`Failed to get VVN: Authentication failed (401). ${error.message}`);
                }
            }
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw new Error(`Failed to get VVN: ${error.message}`);
        }
    }
}
exports.VvnClientService = VvnClientService;
//# sourceMappingURL=VvnClientService.js.map