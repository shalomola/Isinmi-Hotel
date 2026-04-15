export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_PATHS = {
  ROOMS: {
    GET_ALL:   "/api/room",
    GET_BY_ID: (id) => `/api/room/${id}`,
  },
  CATEGORIES: {
    GET_ALL:   "/api/category",
    GET_BY_ID: (id) => `/api/category/${id}`,
  },
  BOOKINGS: {
    CREATE:    "/api/booking",
    CHECK_AVAILABILITY: "/api/booking/category/:categoryId/availability",
  },
};
