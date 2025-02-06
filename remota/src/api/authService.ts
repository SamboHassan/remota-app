import { apiClient } from "./apiClient";
import Cookies from "js-cookie";

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    username: string;
    email: string;
  };
}

export const signup = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>("/api/users", { username, email, password });

    // Store tokens in cookies
    Cookies.set("access_token", response.data.access_token, { secure: true, httpOnly: false });
    Cookies.set("refresh_token", response.data.refresh_token, { secure: true, httpOnly: false });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>("/api/login", { email, password });

    // Store tokens in cookies
    Cookies.set("access_token", response.data.access_token, { secure: true, httpOnly: false });
    Cookies.set("refresh_token", response.data.refresh_token, { secure: true, httpOnly: false });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Function to retrieve tokens
export const getAccessToken = (): string | undefined => Cookies.get("access_token");
export const getRefreshToken = (): string | undefined => Cookies.get("refresh_token");

// Function to remove tokens (for logout)
export const logout = (): void => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
};

