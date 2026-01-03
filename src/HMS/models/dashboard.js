import api from "../services/api";

export const orderSchema = {
  id: "",
  category: "",
  total: 0,
  items: [], // list of order items
  status: "New",
};

export const orderService = {
  list: (params) => api.get("/orders", { params }),
  get: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post("/orders", data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/${id}`),
};
