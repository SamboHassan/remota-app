"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { login, signup } from "@/api/authService";
import Cookies from "js-cookie";

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  signupUser: (username: string, email: string, password: string, is_admin:boolean) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);


// BEGINNING AUTH PROVIDER
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  //UseEffect to load user from cookies
  useEffect(() => {

    const loadUserFromCookies = () => {
      const storedAccessToken = Cookies.get("access_token");
      const storedUser = Cookies.get("user");

      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user cookie:", error);
          Cookies.remove("user"); // Clear invalid cookie
        }
      }
    };

    loadUserFromCookies(); // Call the function to load on mount

    // const savedAccessToken = Cookies.get("access_token");
    // const savedUser = Cookies.get("user");

    // if (savedAccessToken) {
    //   setAccessToken(savedAccessToken);
    // }

    // if (savedUser) {
    //   try {
    //     setUser(JSON.parse(savedUser)); // 
    //   } catch (error) {
    //     console.error("Error parsing user cookie:", error);
    //     Cookies.remove("user"); // Remove invalid cookie
    //   }
    // }
  }, []);


//AUTH PROVIDER LOGIN USER
const loginUser = async (email: string, password: string) => {
  try {
    const response = await login(email, password);
    console.log(response)
    
    setUser(response.user);
    setAccessToken(response.access_token);

    // Secure and HttpOnly flags for production
    const cookieOptions = { 
      secure: process.env.NODE_ENV === 'production',  // Only secure in production
      httpOnly: false, // httpOnly: true is generally recommended but may cause issues with client-side rendering. If you can use server components for auth this should be true.
      expires: 1 
    };

    // Store tokens and user data in cookies
    Cookies.set(
      "access_token", 
      response.access_token, { secure: true, httpOnly: false, expires: 1 }
    );
    Cookies.set(
      "refresh_token", 
      response.refresh_token, { secure: true, httpOnly: false, expires: 7 }
    ); 
    // Longer expiration for refresh token
    Cookies.set(
      "user", JSON.stringify(response.user), { expires: 1 }
    );

    // setUser(response.user);
  } catch (error) {
    console.error("Login Error in Context:", error);
    // Handle the error appropriately, e.g., display an error message
    throw error; // Re-throw the error to be handled by the component calling loginUser
  }
  
};

//AUTH PROVIDER SIGNUP USER
const signupUser = async (
  username: string, 
  email: string, 
  password: string, 
  is_admin:boolean
) => {
   try {
      await signup(username, email, password, is_admin);
      await loginUser(email, password); // Log in the user after signup
    } catch (error) {
      console.error("Signup Error in Context:", error);
      throw error; // Let the component handle the error
    }
};

// AUTH PROVIDER LOGOUT SECTION
const logoutUser = () => {
  setUser(null);
  setAccessToken(null);
  // Remove tokens and user data from cookies
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("user");

 };

  return (
    <AuthContext.Provider value={
        { user, accessToken, loginUser, signupUser, logoutUser }
      }> {children}
    </AuthContext.Provider>
  );
};


// USEAUTH FUNCTION
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
