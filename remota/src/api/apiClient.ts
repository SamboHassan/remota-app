import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token is expired and we have a refresh token, try to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        // Request a new token
        const { data } = await axios.post(`${API_BASE_URL}/api/refresh`, { refresh_token: refreshToken });

        // Store the new tokens
        Cookies.set("access_token", data.access_token, { secure: true, httpOnly: false });
        Cookies.set("refresh_token", data.refresh_token, { secure: true, httpOnly: false });

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("Token refresh failed", err);
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


// Add an interceptor to attach the token dynamically
// apiClient.interceptors.request.use((config) => {
//   const token = Cookies.get("access_token"); // Retrieve token from cookies

//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`; // Attach token
//   }

//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });





// import axios from "axios";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": process.env.NEXT_PUBLIC_API_TOKEN,
//   },
// });
