import axios from 'axios';
import { LoginRequest, LoginResponse } from '@/types/auth';

const API_BASE_URL = 'http://localhost:8000';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/login`,
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  // Helper function to set authorization header for future requests
  setAuthToken(token: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Helper function to remove authorization header
  removeAuthToken() {
    delete axios.defaults.headers.common['Authorization'];
  },
};
