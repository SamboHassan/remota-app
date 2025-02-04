import { useState } from "react";
import { applyForJob, Job } from "@/api/jobService";

interface JobApplicationFormProps {
  job: Job;
  onClose: () => void;
}

export default function JobApplicationForm({ job, onClose }: JobApplicationFormProps) {
  const [applicantName, setApplicantName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setResume(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await applyForJob({ job_id: job.id, applicant_id: applicantName, email, resume, cover_letter: coverLetter });
      setSuccessMessage("Application submitted successfully!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Apply for {job.title}</h2>
        {successMessage ? (
          <p className="text-green-600">{successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" placeholder="Full Name" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} required className="w-full p-2 border rounded" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
            <textarea placeholder="Cover Letter" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} required className="w-full p-2 border rounded" />
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="w-full p-2 border rounded" />
            <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 w-full rounded">
              {loading ? "Submitting..." : "Submit Application"}
            </button>
            <button type="button" onClick={onClose} className="text-gray-600 w-full text-center mt-2">
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
