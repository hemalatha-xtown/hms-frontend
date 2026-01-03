import api from "../services/api"; // Axios instance

export const menuService = {
  // Create a new order
  create: (data) => api.post("/order/order", data),

  // Get all orders (or menu items)
  list: () => api.get("/order/order"),

  // Get a single order by ID
  get: (id) => api.get(`/order/order/${id}`),
  getTables: () => api.get("/dining-table"),
};

export const billService = {
  // Generate bill for an order
  generate: (order_id) => api.post("/order/bill/generate", { order_id }),
};

export const paymentService = {
  // Create payment for a bill
  create: (data) => api.post("/order/payment/createPayment", data),
  list: (params) => api.get("/order/payment/getPayments", { params })
};