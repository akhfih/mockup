'use client';

import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { AuthContextType, LoginRequest, User } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load token from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            authService.setAuthToken(savedToken);
        }

        setIsLoading(false);
        // Axios interceptor untuk handle token expired
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    authService.removeAuthToken();
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.login(credentials);
            const { access_token } = response;
            // Set role to 'admin' if username is 'admin', else 'user'
            const userObj: User = {
                username: credentials.username,
                role: credentials.username === 'admin' ? 'admin' : 'user',
            };

            setToken(access_token);
            setUser(userObj);
            localStorage.setItem('auth_token', access_token);
            localStorage.setItem('auth_user', JSON.stringify(userObj));
            authService.setAuthToken(access_token);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        authService.removeAuthToken();
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        isLoading,
        isAuthenticated: !!token && !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
