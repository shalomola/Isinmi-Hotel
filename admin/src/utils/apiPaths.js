export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("API Base URL:", BASE_URL);

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
    },
    CATEGORIES: {
        GET_ALL: "/api/category",
        GET_BY_ID: (categoryId) => `/api/category/${categoryId}`,
        CREATE: "/api/category",
        UPDATE: (categoryId) => `/api/category/${categoryId}`,
        DELETE: (categoryId) => `/api/category/${categoryId}`,
    },
    FEATURES: {
        GET_ALL: "/api/feature",
        GET_BY_ID: (featureId) => `/api/feature/${featureId}`,
        CREATE: "/api/feature",
        UPDATE: (featureId) => `/api/feature/${featureId}`,
        DELETE: (featureId) => `/api/feature/${featureId}`,
    },
    ROOMS: {
        GET_ALL: "/api/room",
        GET_BY_ID: (roomId) => `/api/room/${roomId}`,
        CREATE: "/api/room",
        UPDATE: (roomId) => `/api/room/${roomId}`,
        DELETE: (roomId) => `/api/room/${roomId}`,
    },
    BOOKINGS: {
        GET_ALL: "/api/booking",
        GET_BY_ID: (bookingId) => `/api/booking/${bookingId}`,
        CREATE: "/api/booking",
        UPDATE: (bookingId) => `/api/booking/${bookingId}`,
        DELETE: (bookingId) => `/api/booking/${bookingId}`,
    },
    USERS: {
        GET_ALL: "/api/user",
        CREATE: "/api/user",
        GET_BY_ID: (userId) => `/api/user/${userId}`,
        UPDATE: (userId) => `/api/user/${userId}`,
        DELETE: (userId) => `/api/user/${userId}`,
        PROFILE: "/api/user/profile",
        UPDATE_PROFILE: "/api/user/updateProfile",
    },
};