import api from "../services/api";

export const paymentSchema = {
  id: "",
  order_id: "",
  bill_id: "",
  bill_amount: 0,
  method: "",
  status: "",
  transactionId: null,
  is_active: true,
  created_by: null,
  updated_by: null,
  deleted_by: null,
  createdAt: "",
  updatedAt: "",
};

export const paymentService = {
  list: (params) => api.get("/order/payment/getPayments", { params }),
  get: (id) => api.get(`/payment/getPaymentById/${id}`),
};
