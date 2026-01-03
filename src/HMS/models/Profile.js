import api from "../services/api";

export const profileSchema = {
  id: "",
  company_name: "",
  address: "",
  gst_number: "",
  phone: "",
  email: "",
  profile_image: null,
};

export const profileService = {
  // Fetch profiles
  list: () => api.get("/profile"), // your API GET

  create: (data) => api.post("/profile", data),
  update: (id, data) => api.put(`/profile/${id}`, data),
  delete: (id) => api.delete(`/profile/${id}`),
};