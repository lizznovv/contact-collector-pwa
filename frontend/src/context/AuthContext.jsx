/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {

        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);

            return parsedUser;
        }
        return null;
    });

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const value = {
        user: user,
        isAuthenticated: user ? true : false,
        login: login,
        logout: logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};