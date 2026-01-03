// src/services/qrService.js
import api from "../services/api";

export const tableSchema = {
  id: "",                  
  table_number: "",         
  is_active: true,          
  created_by: null,        
  updated_by: null,         
  deleted_by: null,         
  created_by_name: null,    
  updated_by_name: null,    
  deleted_by_name: null,    
  created_by_email: null,  
  updated_by_email: null,   
  deleted_by_email: null,  
  createdAt: "",           
  updatedAt: "",            
};

export const tableService = {
  list: (params) => api.get("/dining-table", { params }),   
  get: (id) => api.get(`/dining-table/${id}`),
  create: (data) => api.post("/dining-table", data),
  update: (id, data) => api.patch(`/dining-table/${id}`, data),
};
