import axios, { AxiosInstance } from 'axios';
import config from '../../config';

export interface VvnDto {
  id: string;
  vesselId: string;
  vesselName: string;
  vesselIMO: string;
  status: string;
  eta: string;
  etd: string;
}

export class VvnClientService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.backendApiUrl;
    this.client = axios.create({
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
  async vvnExists(vvnId: string): Promise<boolean> {
    try {
      const response = await this.client.get(`/vesselVisitNotifications/${vvnId}`);
      return response.status === 200 && response.data !== null;
    } catch (error: any) {
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
  async getVvnById(vvnId: string): Promise<VvnDto | null> {
    try {
      const response = await this.client.get(`/vesselVisitNotifications/${vvnId}`);
      if (response.status === 200 && response.data) {
        return response.data as VvnDto;
      }
      return null;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw new Error(`Failed to get VVN: ${error.message}`);
    }
  }
}

