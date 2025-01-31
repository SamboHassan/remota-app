import { useEffect, useState } from "react";
import { fetchJobs, Job } from "@/api/jobService";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length ? (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 mb-2">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p>{job.company} - {job.location}</p>
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs available.</p>
      )}
    </div>
  );
}
