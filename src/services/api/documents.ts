import { apiRequest } from "./client";
export const getMyDocuments = (token: string) => apiRequest("candidates/me/documents/", {}, token);
