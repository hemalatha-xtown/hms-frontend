import api from "../services/api";

// Default form values
export const categorySchema = {
  id: "",
  item_name: "",
  description: "",
  price: null,
  tax_id: null,
  meal_type: "",
  is_available: true,
  is_multi_course: false,
  image: "",
};

// Category API service
export const categoryService = {
  list: (params) => api.get("/category/category", { params }),
  create: (data) => api.post("/category/category", data),
  update: (id, data) => api.put(`/category/category/${id}`, data),
  delete: (id) => api.delete(`/category/category/${id}`),
};

// Meal type options
export const mealTypeOptions = ["Breakfast", "Lunch", "Dinner", "Snack"];
export const foodTypeOptions = ["Veg", "Non-Veg"];
