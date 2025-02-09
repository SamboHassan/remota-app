"use client"

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const SignupPage = ()=> {
  const { signupUser } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); 

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signupUser(username, email, password, isAdmin);
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          className="border p-2 w-72" 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="border p-2 w-72" 
        />
        <input type="password" 
          placeholder="Password" 
          value={password} onChange={(e) => setPassword(e.target.value)} 
          required 
          className="border p-2 w-72" 
        />
        <button 
          type="submit" 
          className="bg-green-500 text-white p-2 w-72"
          >Sign Up</button>

        <label className="flex items-center">
          <input type="checkbox" 
              checked={isAdmin} 
              onChange={(e) => setIsAdmin(e.target.checked)} 
              className="mr-2" />
            Admin?
        </label>
      </form>
    </div>
  );
}

export default SignupPage