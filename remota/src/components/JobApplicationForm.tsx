// // components/JobApplicationForm.tsx  trigger when apply is clicked
// import { useState } from 'react';

// interface FormData {
//   name: string;
//   email: string;
//   resume: File | null;
//   coverLetter: string;
// }

// const JobApplicationForm: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     email: '',
//     resume: null,
//     coverLetter: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFormData({ ...formData, [e.target.name]: e.target.files[0] });
//     }
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log(formData); // Placeholder for now
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold mb-4">Job Application</h2>

//       <div className="mb-4">
//         <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
//         <input
//           type="text"
//           id="name"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
//         <input
//           type="email"
//           id="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           required
//         />
//       </div>

//       <div className="mb-4">
//         <label htmlFor="resume" className="block text-gray-700 font-medium mb-2">Resume</label>
//         <input
//           type="file"
//           id="resume"
//           name="resume"
//           onChange={handleFileChange}
//           className="w-full"
//           required
//         />
//       </div>

//       <div className="mb-6">
//         <label htmlFor="coverLetter" className="block text-gray-700 font-medium mb-2">Cover Letter</label>
//         <textarea
//           id="coverLetter"
//           name="coverLetter"
//           value={formData.coverLetter}
//           onChange={handleChange}
//           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
//       >
//         Submit Application
//       </button>
//     </form>
//   );
// };

// export default JobApplicationForm;











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
  const [errorMessage, setErrorMessage] = useState(""); // Add error message state

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setResume(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear any previous errors

    try {
      await applyForJob({
        job_id: job.id,
        applicant_id: applicantName,
        email,
        resume,
        cover_letter: coverLetter,
      });

      setSuccessMessage("Application submitted successfully!");
      // Clear form fields after successful submission
      setApplicantName("");
      setEmail("");
      setResume(null);
      setCoverLetter("");


      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) { // Type the error as any or a specific error type if available
      console.error("Error applying for job:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Display error from backend
      } else if (typeof error === 'string') {
        setErrorMessage(error);
      }
      else {
        setErrorMessage("Failed to submit application. Please try again."); // Generic error
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"> {/* Add z-index */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative"> {/* Added relative for close button positioning */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold mb-4">Apply for {job.title}</h2>
        {successMessage && <p className="text-green-600 mb-2">{successMessage}</p>} {/* Moved success message up, added margin */}
        {errorMessage && <p className="text-red-600 mb-2">{errorMessage}</p>} {/* Display error message */}
        {!successMessage && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Cover Letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              className="w-full p-2 border rounded h-24" // Added height
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 text-white p-2 w-full rounded ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} // Disable button visually
            >
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



// -----------------------------------------------------------------------------



// import { useState } from "react";
// import { applyForJob, Job } from "@/api/jobService";

// interface JobApplicationFormProps {
//   job: Job;
//   onClose: () => void;
// }

// export default function JobApplicationForm(
//   { job, onClose }: JobApplicationFormProps
// ) {
//   const [applicantName, setApplicantName] = useState("");
//   const [email, setEmail] = useState("");
//   const [resume, setResume] = useState<File | null>(null);
//   const [coverLetter, setCoverLetter] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setResume(event.target.files[0]);
//     }
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setLoading(true);

//     try {
//       await applyForJob(
//         { 
//           job_id: job.id, 
//           applicant_id: applicantName, 
//           email, 
//           resume, 
//           cover_letter: coverLetter 
//         }
//       );

//       setSuccessMessage("Application submitted successfully!");

//       setTimeout(() => {
//           onClose();
//         }, 2000
//       );
//     } catch (error) {
//       console.error("Error applying for job:", error);
//         alert("Failed to submit application.");
//     } finally {
//         setLoading(false);
//     }
//   };

//   return (
//     <div 
//       className="fixed inset-0 flex items-center justify-center 
//         bg-gray-800 bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-lg font-semibold mb-4">Apply for {job.title}</h2>
//         {successMessage ? (
//           <p className="text-green-600">{successMessage}</p>
//         ) : (
//           <form 
//             onSubmit={handleSubmit} 
//             className="space-y-3">
//             <input 
//               type="text" 
//               placeholder="Full Name" 
//               value={applicantName} 
//               onChange={(e) => setApplicantName(e.target.value)} 
//               required 
//               className="w-full p-2 border rounded" 
//               />
//             <input 
//               type="email" 
//               placeholder="Email" 
//               value={email} 
//               onChange={(e) => setEmail(e.target.value)} 
//               required 
//               className="w-full p-2 border rounded" 
//               />
//             <textarea 
//               placeholder="Cover Letter" 
//               value={coverLetter} 
//               onChange={(e) => setCoverLetter(e.target.value)} 
//               required 
//               className="w-full p-2 border rounded" 
//               />
//             <input 
//               type="file" 
//               accept=".pdf,.doc,.docx" 
//               onChange={handleFileChange} 
//               className="w-full p-2 border rounded" 
//               />
//             <button 
//               type="submit" 
//               disabled={loading} 
//               className="bg-blue-500 text-white p-2 w-full rounded">
//               {loading ? "Submitting..." : "Submit Application"}
//             </button>
//             <button 
//               type="button" 
//               onClick={onClose} 
//               className="text-gray-600 w-full text-center mt-2">
//               Cancel
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }













// import { useState } from "react";
// import { applyForJob, Job } from "@/api/jobService";

// interface JobApplicationFormProps {
//   job: Job;
//   onClose: () => void;
// }

// export default function JobApplicationForm({ job, onClose }: JobApplicationFormProps) {
//   const [applicantName, setApplicantName] = useState("");
//   const [email, setEmail] = useState("");
//   const [resume, setResume] = useState<File | null>(null);
//   const [coverLetter, setCoverLetter] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setResume(event.target.files[0]);
//     }
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setLoading(true);

//     try {
//       await applyForJob({ job_id: job.id, applicant_id: applicantName, email, resume, cover_letter: coverLetter });
//       setSuccessMessage("Application submitted successfully!");
//       setTimeout(() => {
//         onClose();
//       }, 2000);
//     } catch (error) {
//       console.error("Error applying for job:", error);
//       alert("Failed to submit application.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
//       <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">
//         <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">Apply for {job.title}</h2>

//         {successMessage ? (
//           <p className="text-green-600 text-center">{successMessage}</p>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={applicantName}
//               onChange={(e) => setApplicantName(e.target.value)}
//               required
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
//             />
//             <textarea
//               placeholder="Cover Letter"
//               value={coverLetter}
//               onChange={(e) => setCoverLetter(e.target.value)}
//               required
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
//             />
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx"
//               onChange={handleFileChange}
//               className="w-full p-3 border rounded-lg bg-gray-100"
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-blue-600 text-white p-3 w-full rounded-lg transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
//             >
//               {loading ? "Submitting..." : "Submit Application"}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="text-gray-600 w-full text-center mt-2 hover:text-gray-800"
//             >
//               Cancel
//             </button>
//           </form>
//         )}
//       </div>
//     </main>
//   );
// }
