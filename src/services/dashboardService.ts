import axios from 'axios';
import { DashboardResponse } from '@/types/dashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export interface DashboardFilters {
  time_filter?: 'daily' | 'weekly' | 'monthly' | 'all_time';
  create_from?: string; // format: 'YYYY-MM-DD' atau 'YYYY-MM-DDTHH:mm:ss'
  create_end?: string;  // format: 'YYYY-MM-DD' atau 'YYYY-MM-DDTHH:mm:ss'
}

export interface ChartFilters {
  chart_type: 'yearly' | 'daily' | 'weekly';
  link_type?: 'enterprise' | 'wholesale' | 'all';
  years?: number[];
  days_back?: number[];
  weeks_back?: number[];
  customer_name?: string;
  link_id?: string;
  current_date?: string;
}

export interface ChartResponse {
  chart_type: string;
  title: string;
  subtitle: string;
  link_type: string;
  series: Array<{
    name: string;
    data: Array<{
      label: string;
      value: string;
      percentage_change: number;
      comparison_value: number;
    }>;
    color: string;
  }>;
  x_axis_labels: string[];
  total_current: number;
  total_previous: number;
  overall_change_percentage: number;
  insights: string[];
}

export const dashboardService = {
  async getDashboardData(filters?: DashboardFilters): Promise<DashboardResponse> {
    try {
      const response = await axios.get<DashboardResponse>(`${API_BASE_URL}/dashboard`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  },

  async getChartData(filters: ChartFilters): Promise<ChartResponse> {
    try {
      const response = await axios.get<ChartResponse>(`${API_BASE_URL}/mttrchart`, {
        params: filters,
        paramsSerializer: {
          indexes: null // This will serialize arrays as: years=2023&years=2024&years=2025
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw new Error('Failed to fetch chart data');
    }
  }
};
