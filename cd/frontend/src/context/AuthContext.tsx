import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axios";

type User = {
    name: string
    email: string
}

type UserAuth = {
    isLoggedIn: boolean
    user: User | null
    token: string | null
    login: (token: string, user: User) => void
    logout: () => void
}

const AuthContext = createContext<UserAuth | null>(null)

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [token, setToken] = useState<string | null>(null)
    const navigate = useNavigate();
    
    // Check for existing auth data in localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);
    
    const login = (token: string, user: User) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setToken(token);
        setUser(user);
        setIsLoggedIn(true);
    };
    
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
        navigate("/login");
    };

    const value = {
        isLoggedIn,
        user,
        token,
        login,
        logout
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};