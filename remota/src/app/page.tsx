"use client"

import { useEffect, useState } from "react";
import { fetchJobs, Job } from "@/api/jobService";
import JobApplicationForm from "@/components/JobApplicationForm";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
    <main className="p-6">
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
              <button onClick={() => setSelectedJob(job)} className="bg-green-500 text-white px-3 py-1 rounded mt-2">
                Apply
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs available.</p>
      )}

      {selectedJob && <JobApplicationForm job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </main>
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}





// import { useEffect, useState } from "react";
// import { fetchJobs, Job } from "@/api/jobService";
// // import JobApplicationForm from "@/components/JobApplicationForm";

// export default function Home() {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchJobs()
//       .then(setJobs)
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
//       {loading ? (
//         <p>Loading jobs...</p>
//       ) : jobs.length ? (
//         <ul>
//           {jobs.map((job) => (
//             <li key={job.id} className="border p-4 mb-2">
//               <h2 className="text-xl font-semibold">{job.title}</h2>
//               <p>{job.company} - {job.location}</p>
//               <p>{job.description}</p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No jobs available.</p>
//       )}
//     </div>
//   );
// }
