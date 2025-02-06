import { apiClient } from "./apiClient";
import axios from 'axios';

export interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  location: string;
  postedAt: string;
  postedBy: string;
}

export interface JobApplication {
  job_id: number;
  applicant_id: number;
  email: string;
  resume: File | null;
  cover_letter: string;
}

interface ApplyJobData {  // MUST match ApplyJobSchema
  resume_url: string;
  cover_letter: string;
}

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await apiClient.get<Job[]>("/api/jobs");
  return response.data;
};


export const applyForJob = async (job_id: number, applicationData: ApplyJobData): Promise<void> => {
  try {
    const response = await apiClient.post("/api/jobs/${job_id}/apply")

    console.log("Application submitted successfully!", response.data); // Log the response data

  } catch (error) {
    console.error("Error submitting application:", error);
  }
};

// Example usage:
// const applicationData: ApplyJobData = {  // Data MUST match the schema!
//   resume_url: "http://example.com/my-resume.pdf",
//   cover_letter: "I am excited about this job opportunity.",
// };

// const jobId = 123; // The actual job ID
// applyForJob(jobId, applicationData);


// export const applyForJob = async (application: JobApplication): Promise<void> => {
//   const formData = new FormData();
//   formData.append("job_id", application.job_id.toString());
//   formData.append("applicant_id", application.applicant_id.toString());
//   formData.append("email", application.email);
//   if (application.resume) {
//     formData.append("resume", application.resume);
//   }
//   formData.append("cover_letter", application.cover_letter);

//   await apiClient.post("/api/jobs/:job_id/apply", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };