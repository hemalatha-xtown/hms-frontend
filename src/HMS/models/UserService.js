// src/services/userService.js
import api from "../services/api";

export const userService = {
  register: (data) => api.post("/user/user/register", data),
  login: (data) => api.post("/user/user/login", data), 
  getUser: (id) => api.get(`/user/user/${id}`),       
};
