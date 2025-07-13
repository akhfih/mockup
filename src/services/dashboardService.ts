import axios from 'axios';
import { DashboardResponse } from '@/types/dashboard';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const dashboardService = {
  async getDashboardData(): Promise<DashboardResponse> {
    try {
      const response = await axios.get<DashboardResponse>(`${API_BASE_URL}/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }
};
