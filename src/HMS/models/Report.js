import api from "../services/api";

// ✅ Schema for a single report row
export const reportSchema = {
  id: "",
  date: "",
  menuItem: "",
  qty: 0,
  price: 0,
  total: 0,
};

export const reportService = {
  // ✅ Get reports (fetch all payments)
  list: (params) => api.get("/order/daily-report", { params }),
  get: (id) => api.get(`order/daily-report/${id}`),
  create: (data) => api.post("/admin/report", data),
  update: (id, data) => api.put(`/admin/report/${id}`, data),
  delete: (id) => api.delete(`/payment/deletePayment/${id}`),
  restore: (id) => api.patch(`/admin/report/restore/${id}`),
  summary: (params) => api.get("/admin/report/summary", { params }),
};
