"use client"

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { loginUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await loginUser(email, password);
      router.push("/");
    } catch (error) {
      alert("Invalid login credentials");
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l-4 4m0 0l-4-4m4 4V6m8 14l4-4m0 0l-4-4m4 4H12" />
        </svg>
        <h2 className="text-2xl font-semibold">Login</h2>
      </div>
      {/* <h2 className="text-2xl mb-4">Login</h2> */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 w-72">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border p-2 w-72" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="border p-2 w-72" />
        <button type="submit" className="bg-blue-500 text-white p-2 w-72">Login</button>
      </form>
    </div>
  );
}
