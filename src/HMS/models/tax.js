import api from "../services/api";

export const taxSchema = {
  id: "",
  hsn_sac_code: "",
  taxable_value: null, 
  tax_type: "",
  is_active: true,
  created_by: null,
  updated_by: null,
  deleted_by: null,
  createdAt: "",
  updatedAt: "",
  deleted_at: null,
};

export const taxService = {
  list: (params) => api.get("/tax", { params }),
  get: (id) => api.get(`/tax/${id}`),
  create: (data) => api.post("/tax", data),
  update: (id, data) => api.put(`/tax/${id}`, data),
  delete: (id) => api.delete(`/tax/${id}`),
};
