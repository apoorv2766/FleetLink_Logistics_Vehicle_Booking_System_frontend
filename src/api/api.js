import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

export const addVehicle = (vehicleData) => API.post("/vehicles", vehicleData);

export const getAvailableVehicles = async ({ capacityRequired, fromPincode, toPincode, startTime }) => {
  return API.get("/vehicles/available", {
    params: { capacityRequired, fromPincode, toPincode, startTime },
  });
};

export const createBooking = (bookingData) =>
  API.post("/bookings", bookingData);

export const deleteBooking = (bookingId) =>
  API.delete(`/bookings/${bookingId}`);
