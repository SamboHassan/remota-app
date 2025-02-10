import { Job } from "@/api/jobService";

interface JobDetailsProps {
  job: Job;
  onApply: () => void;
}

export default function JobDetails({ job, onApply }: JobDetailsProps) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 text-center">{job.title}</h1>
        <p className="text-gray-700 text-center text-lg mt-2">{job.company} - {job.location}</p>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
          <p className="text-gray-600 mt-2">{job.description}</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onApply}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-lg transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          >
            Apply Now
          </button>
        </div>
      </div>
    </main>
  );
}
