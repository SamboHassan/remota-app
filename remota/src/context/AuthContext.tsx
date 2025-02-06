"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { login, signup } from "@/api/authService";
import Cookies from "js-cookie";

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  signupUser: (username: string, email: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const savedAccessToken = Cookies.get("access_token");
    const savedUser = Cookies.get("user");

    if (savedAccessToken && savedUser) {
      setAccessToken(savedAccessToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginUser = async (email: string, password: string) => {
    const response = await login(email, password);
    
    setUser(response.user);
    setAccessToken(response.access_token);

    // Store tokens and user data in cookies
    Cookies.set("access_token", response.access_token, { secure: true, httpOnly: false, expires: 1 });
    Cookies.set("refresh_token", response.refresh_token, { secure: true, httpOnly: false, expires: 7 }); // Longer expiration for refresh token
    Cookies.set("user", JSON.stringify(response.user), { expires: 1 });
  };

  const signupUser = async (username: string, email: string, password: string) => {
    await signup(username, email, password);
    await loginUser(email, password);
  };

  const logoutUser = () => {
    setUser(null);
    setAccessToken(null);
    
    // Remove tokens and user data from cookies
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loginUser, signupUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
