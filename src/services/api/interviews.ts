import { apiRequest } from "./client";
export const getMyInterviews = (token: string) => apiRequest("candidates/me/interviews/", {}, token);
