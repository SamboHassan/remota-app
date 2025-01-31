import { apiClient } from "./apiClient";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
}

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await apiClient.get<Job[]>("/jobs");
  return response.data;
};
