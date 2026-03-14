

import { apiClient } from "./apiClient";

export const adminApi = {
  
  getMovies: (params) => apiClient.get("/api/movies", params),
  getMovie: (id) => apiClient.get(`/api/movies/${id}`),
  createMovie: (data) => apiClient.post("/api/movies", data),
  updateMovie: (id, data) => apiClient.put(`/api/movies/${id}`, data),
  deleteMovie: (id) => apiClient.delete(`/api/movies/${id}`),

  
  getTheaters: (params) => apiClient.get("/api/theaters", params),
  getTheater: (id) => apiClient.get(`/api/theaters/${id}`),
  createTheater: (data) => apiClient.post("/api/theaters", data),
  updateTheater: (id, data) => apiClient.put(`/api/theaters/${id}`, data),
  deleteTheater: (id) => apiClient.delete(`/api/theaters/${id}`),
  getTheaterMovies: (theaterId) =>
    apiClient.get(`/api/theaters/${theaterId}/movies`),
  addMoviesToTheater: (theaterId, movieIds) =>
    apiClient.post(`/api/theaters/${theaterId}/movies`, { movieIds }),

  
  getShows: (params) => apiClient.get("/api/show", params),
  getShow: (id) => apiClient.get(`/api/show/${id}`),
  createShow: (data) => apiClient.post("/api/show", data),
  updateShow: (id, data) => apiClient.put(`/api/show/${id}`, data),
  deleteShow: (id) => apiClient.delete(`/api/show/${id}`),

  
  getUsers: () => Promise.resolve({ data: [] }), 
  getUser: (email) => apiClient.get(`/api/users/user`, { email }),
  updateUserRole: (userId, role) =>
    apiClient.patch(`/api/users/${userId}/role`, { userRole: role }),
  updateUserStatus: (userId, status) =>
    apiClient.patch(`/api/users/${userId}/role`, { userStatus: status }),
  blockUser: (userId) =>
    apiClient.patch(`/api/users/${userId}/role`, { userStatus: "REJECTED" }),
  unblockUser: (userId) =>
    apiClient.patch(`/api/users/${userId}/role`, { userStatus: "APPROVED" }),

  
  getBookings: (params) => apiClient.get("/api/booking", params),
  getBooking: (id) => apiClient.get(`/api/booking/${id}`),
  cancelBooking: (id) =>
    apiClient.patch(`/api/booking/${id}`, { status: "cancelled" }),

  
  getDashboardStats: () => apiClient.get("/api/analytics/dashboard"),
  getMovieStats: (movieId) => apiClient.get(`/api/analytics/movies/${movieId}`),
  getTheaterStats: (theaterId) =>
    apiClient.get(`/api/analytics/theaters/${theaterId}`),
  getRevenueStats: (params) => apiClient.get("/api/analytics/revenue", params),
  getBookingTrends: (params) =>
    apiClient.get("/api/analytics/bookings/trends", params),

  
  exportMovies: () =>
    apiClient.get("/api/admin/export/movies", {
      responseType: "blob",
    }),
  exportBookings: (params) =>
    apiClient.get("/api/admin/export/bookings", params, {
      responseType: "blob",
    }),
  exportUsers: () =>
    apiClient.get("/api/admin/export/users", {
      responseType: "blob",
    }),
};

export default adminApi;
