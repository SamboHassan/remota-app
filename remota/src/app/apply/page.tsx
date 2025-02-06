import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import JobApplicationForm from "@/components/JobApplicationForm";

export default function ApplyPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Apply for a Job</h1>
      <JobApplicationForm job={{ id: 1, title: "Software Engineer", company: "Tech Corp", location: "Remote", description: "Exciting job opportunity!", requirements: ["JavaScript", "React"] }} onClose={() => router.push("/")} />
    </div>
  );
}
