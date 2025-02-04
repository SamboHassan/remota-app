"use client"


import { createContext, useContext, useEffect, useState } from "react";
import { login, signup } from "@/api/authService";
import Cookies from "js-cookie";

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  signupUser: (username: string, email: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = Cookies.get("token");
    const savedUser = Cookies.get("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginUser = async (email: string, password: string) => {
    const response = await login(email, password);
    setUser(response.user);
    setToken(response.token);
    Cookies.set("token", response.token, { expires: 1 });
    Cookies.set("user", JSON.stringify(response.user), { expires: 1 });
  };

  const signupUser = async (username: string, email: string, password: string) => {
    await signup(username, email, password);
    await loginUser(email, password);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("token");
    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, signupUser, logoutUser }}>
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




// import { createContext, useContext, useEffect, useState } from "react";
// import { login, signup } from "@/api/authService";

// interface User {
//   username: string;
//   email: string;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   loginUser: (email: string, password: string) => Promise<void>;
//   signupUser: (username: string, email: string, password: string) => Promise<void>;
//   logoutUser: () => void;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     const savedUser = localStorage.getItem("user");
//     if (savedToken && savedUser) {
//       setToken(savedToken);
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   const loginUser = async (email: string, password: string) => {
//     const response = await login(email, password);
//     setUser(response.user);
//     setToken(response.token);
//     localStorage.setItem("token", response.token);
//     localStorage.setItem("user", JSON.stringify(response.user));
//   };

//   const signupUser = async (username: string, email: string, password: string) => {
//     await signup(username, email, password);
//     await loginUser(email, password);
//   };

//   const logoutUser = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, loginUser, signupUser, logoutUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
