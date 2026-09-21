import { apiRequest } from "./client";
export const getPublishedBlogs = (query = "") => apiRequest(`blogs/${query ? `?${query}` : ""}`);
export const getPublishedBlog = (slug: string) => apiRequest(`blogs/${encodeURIComponent(slug)}/`);
