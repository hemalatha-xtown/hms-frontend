import api from "../services/api"; 

export const kitchenSchema = {
  id: "",
  orderId: "",
  tableNumber: "",
  items: [],
  status: "Pending",
  priority: "Normal",
  createdAt: "",
  updatedAt: "",
};

export const kitchenService = {
  list: (params) => api.get("/order/order", { params }),
  get: (id) => api.get(`/order/order/${id}`),
  create: (data) => api.post("/order/order", data),
  update: (orderIid, data) => api.patch(`/order/order/status/${orderIid}`, data),
  delete: (id) => api.delete(`/order/order/${id}`),
};
