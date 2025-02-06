"use client"

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginPage = () => {


  const { loginUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null)

    try {
      // await loginUser(email, password);
      // router.push("/");
      const { data } = await axios.post("http://localhost:5000/api/login", { email, password });
      
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      
      router.push("/"); // Redirect to dashboard after successful login
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Logo + Login Heading */}
      <div className="flex items-center space-x-2 mb-6">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-blue-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M12 14l-4 4m0 0l-4-4m4 4V6m8 14l4-4m0 0l-4-4m4 4H12" />
        </svg>
        <h2 className="text-2xl font-semibold">Login</h2>
      </div>
      {/* <h2 className="text-2xl mb-4">Login</h2> */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center 
      space-y-4 w-72">
        <input type="email" 
               placeholder="Email" 
               value={email} 
               onChange={(e) => setEmail(e.target.value)} 
               required className="border p-2 w-72" />
        <input type="password" 
              placeholder="Password" 
              value={password} onChange={(e) => 
              setPassword(e.target.value)} 
              required className="border p-2 w-72" />
        <button type="submit" className="bg-blue-500 text-white p-2 w-72">Login</button>
      </form>
    </div>
  );

   return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}



