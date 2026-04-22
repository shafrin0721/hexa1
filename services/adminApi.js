// src/services/adminApi.js
import axios from 'axios';

// Fix for process.env in browser environment
const API_BASE_URL = typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL 
  : 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAPI = {
  // Dashboard APIs
  getDashboardStats: () => 
    apiClient.get('/admin/dashboard/stats'),
  
  getTasks: (status) => 
    apiClient.get(`/admin/tasks${status ? `?status=${status}` : ''}`),
  
  getTeamMembers: () => 
    apiClient.get('/admin/team'),
  
  getRecentActivities: () => 
    apiClient.get('/admin/activities/recent'),
  
  // Inventory APIs
  getInventoryStats: () => 
    apiClient.get('/admin/inventory/stats'),
  
  getInventoryItems: () => 
    apiClient.get('/admin/inventory'),
  
  addInventoryItem: (item) => 
    apiClient.post('/admin/inventory', item),
  
  updateInventoryItem: (id, item) => 
    apiClient.put(`/admin/inventory/${id}`, item),
  
  deleteInventoryItem: (id) => 
    apiClient.delete(`/admin/inventory/${id}`),
  
  // Customer Management APIs
  getCustomerData: () => 
    apiClient.get('/admin/customers/ratings'),
  
  getUnitsData: () => 
    apiClient.get('/admin/customers/units'),
  
  getAssignmentData: () => 
    apiClient.get('/admin/customers/assignment'),
  
  getCommentData: (range) => 
    apiClient.get(`/admin/customers/comments?range=${range || 'week'}`),
  
  getProductivityData: () => 
    apiClient.get('/admin/customers/productivity'),
  
  // Sales APIs
  getSalesMetrics: (range) => 
    apiClient.get(`/admin/sales/metrics?range=${range || 'week'}`),
  
  getLeadsData: () => 
    apiClient.get('/admin/sales/leads'),
  
  getPipelineData: () => 
    apiClient.get('/admin/sales/pipeline'),
  
  getOpportunitiesData: () => 
    apiClient.get('/admin/sales/opportunities'),
  
  getLeadsTable: () => 
    apiClient.get('/admin/sales/leads-table'),
  
  // Logistics APIs
  getMetrics: () => 
    apiClient.get('/admin/logistics/metrics'),
  
  getRevenueCostData: () => 
    apiClient.get('/admin/logistics/revenue-cost'),
  
  getCountryData: () => 
    apiClient.get('/admin/logistics/country'),
  
  getShipmentData: () => 
    apiClient.get('/admin/logistics/shipments'),
  
  getOrdersData: () => 
    apiClient.get('/admin/logistics/orders'),

  // User Management APIs
  getAllUsers: () => 
    apiClient.get('/admin/users'),
  
  getUserById: (id) => 
    apiClient.get(`/admin/users/${id}`),
  
  createUser: (userData) => 
    apiClient.post('/admin/users', userData),
  
  updateUser: (id, userData) => 
    apiClient.put(`/admin/users/${id}`, userData),
  
  deleteUser: (id) => 
    apiClient.delete(`/admin/users/${id}`),
  
  updateUserRole: (id, role) => 
    apiClient.patch(`/admin/users/${id}/role`, { role }),
  
  getUserStats: () => 
    apiClient.get('/admin/users/stats/summary'),

  // Charts & Analytics APIs
  getRevenueData: (range) => 
    apiClient.get(`/admin/charts/revenue?range=${range || 'month'}`),

  getShipmentStatusData: () => 
    apiClient.get('/admin/charts/shipment-status'),

  getOrderStatusData: () => 
    apiClient.get('/admin/charts/order-status'),

  getLocationSalesData: () => 
    apiClient.get('/admin/charts/location-sales'),

  getChannelSalesData: () => 
    apiClient.get('/admin/charts/channel-sales'),

  getCustomerTypeData: () => 
    apiClient.get('/admin/charts/customer-types'),

  getRecentOrders: (limit) => 
    apiClient.get(`/admin/orders/recent?limit=${limit || 10}`),

  getRecentActivities: (limit) => 
    apiClient.get(`/admin/activities/recent?limit=${limit || 10}`),

  getRecentShipments: (limit) => 
    apiClient.get(`/admin/shipments/recent?limit=${limit || 10}`),

  exportData: (type, range) => 
    apiClient.get(`/admin/export/${type}?range=${range || 'month'}`, { responseType: 'blob' }),

  // Order Management APIs
  getOrderById: (orderId) => 
    apiClient.get(`/admin/orders/${orderId}`),

  updateOrderStatus: (orderId, status) => 
    apiClient.patch(`/admin/orders/${orderId}/status`, { status }),

  getAllOrders: (params) => 
    apiClient.get('/admin/orders', { params }),
};

export default adminAPI;