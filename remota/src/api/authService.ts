import { apiClient } from "./apiClient";

interface AuthResponse {
  token: string;
  user: {
    username: string;
    email: string;
  };
}

export const signup = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/signup", { username, email, password });
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/login", { email, password });
  return response.data;
};
