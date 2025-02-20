// handle file uploads within applyForJob


import { apiClient } from "../api/apiClient";
import { AxiosError } from 'axios';

// ... other code (Job interface, fetchJobs, fetchJobById)

interface ApplyJobRequest {
    user_id: number;
    email: string;
    cover_letter: string;
    resume: File | null; // Now includes the File object
}

interface ApplyJobResponse {
    message: string;
    applicant_id: number;
}

export const applyForJob = async (
    job_id: number,
    applicationData: ApplyJobRequest
): Promise<ApplyJobResponse> => {
    try {
        const { resume, ...otherData } = applicationData; // Destructure resume and other data
        if (!resume) {
            throw new Error("Resume is required.");
        }

        const formData = new FormData();
        formData.append("resume", resume); // Append the File object
        formData.append("user_id", otherData.user_id.toString()); // Convert to string
        formData.append("email", otherData.email);
        formData.append("cover_letter", otherData.cover_letter);

        const response = await apiClient.post<ApplyJobResponse>(
            `/api/jobs/${job_id}/apply`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // Important for file uploads
                },
            }
        );

        console.log("Application submitted successfully!", response.data);
        return response.data;
    } catch (error: any) {
        // ... (Error handling remains the same as in the previous example)
    }
};



// How to Use (in your component):

// import { applyForJob } from "./jobService";

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement; // Type the event target
    const resumeFile = form.elements.namedItem("resume") as HTMLInputElement; // Get the file input
    const resume = resumeFile.files ? resumeFile.files[0] : null; // Get the selected file

    if (!resume) {
        alert("Please select a resume file.");
        return;
    }

    const applicationData: ApplyJobRequest = {
        user_id: 3, // ... get from authentication
        email: "user@email.com", // ... get from authentication
        cover_letter: form.elements.namedItem("cover_letter")?.value || "", // Get from form
        resume: resume, // The File object
    };

    try {
        const response = await applyForJob(123, applicationData); // 123 is the job_id
        // ... handle successful response
    } catch (error: any) {
        // ... handle errors
    }
};

// In your JSX form:
<form onSubmit={handleSubmit}>
    <input type="file" name="resume" />
    {/* ... other form fields */}
    <button type="submit">Submit</button>
</form>