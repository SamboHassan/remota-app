import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

interface User {
  id: number;
  email: string;
  role: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
}

const AdminDashboard = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersRes = await fetch("http://127.0.0.1:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const jobsRes = await fetch("http://127.0.0.1:5000/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (usersRes.ok) setUsers(await usersRes.json());
      if (jobsRes.ok) setJobs(await jobsRes.json());
    };

    fetchData();
  }, [token]);

  const deleteJob = async (jobId: number) => {
  if (!confirm("Are you sure you want to delete this job?")) return;

  const res = await fetch(`http://127.0.0.1:5000/jobs/${jobId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  }
};

const promoteUser = async (userId: number) => {
  const res = await fetch(`http://127.0.0.1:5000/users/${userId}/promote`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: "admin" } : user
      )
    );
  }
};


  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {/* Manage Jobs */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Manage Jobs</h2>
          <table className="w-full mt-3 border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Company</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="p-2 border">{job.id}</td>
                  <td className="p-2 border">{job.title}</td>
                  <td className="p-2 border">{job.company}</td>
                  <td className="p-2 border">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => deleteJob(job.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Manage Users */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Manage Users</h2>
          <table className="w-full mt-3 border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="p-2 border">{user.id}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.role}</td>
                  <td className="p-2 border">
                    {user.role !== "admin" && (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => promoteUser(user.id)}
                      >
                        Promote to Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
