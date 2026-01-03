import api from "../services/api";

export const tableService = {
  list: (params) => api.get("/dining-table", { params }),
  create: (data) => api.post("/dining-table", data), 
  update: (id, data) => api.put(`/dining-table/${id}`, data),
  delete: (id) => api.delete(`/dining-table/${id}`),
};