import axios from "axios";
import type {
  ApiError,
  ApiResponse,
  ContactSubmission,
  JobApplication,
} from "../types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 10000,
});
api.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject<ApiError>({
      code: error.code ?? "REQUEST_FAILED",
      message:
        error.response?.data?.message ??
        "Something went wrong. Please try again.",
    }),
);

const mockSubmit = <T>(data: T, message: string) =>
  new Promise<ApiResponse<T>>((resolve) =>
    window.setTimeout(() => resolve({ data, message }), 700),
  );
export const submitContactForm = (payload: ContactSubmission) =>
  mockSubmit(payload, "Thank you. Our team will contact you shortly.");
export const submitJobApplication = (payload: JobApplication) =>
  mockSubmit(
    payload,
    "Your interest has been recorded. We will be in touch if there is a match.",
  );
