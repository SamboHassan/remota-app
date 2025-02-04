import { apiClient } from "./apiClient";

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

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await apiClient.get<Job[]>("/api/jobs");
  return response.data;
};


export const applyForJob = async (application: JobApplication): Promise<void> => {
  const formData = new FormData();
  formData.append("job_id", application.job_id.toString());
  formData.append("applicant_id", application.applicant_id.toString());
  formData.append("email", application.email);
  if (application.resume) {
    formData.append("resume", application.resume);
  }
  formData.append("cover_letter", application.cover_letter);

  await apiClient.post("/api/jobs/:job_id/apply", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
