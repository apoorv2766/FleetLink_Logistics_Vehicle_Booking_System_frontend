import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import { createBooking } from "../api/api";
import { useEffect, useState } from "react";

export default function VehiclesList({
  vehicles: vehiclesProp,
  fromPincode,
  toPincode,
  startTime,
}) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const SlideTransition = (props) => {
    return <Slide {...props} direction="down" />;
  };
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    setVehicles(vehiclesProp);
  }, [vehiclesProp]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleBook = async (vehicleId) => {
    console.log("Booking vehicle:", vehicleId);

    const bookingData = {
      vehicleId,
      fromPincode,
      toPincode,
      startTime,
      customerId: "customer123",
    };
    console.log("Booking data:", bookingData);

    try {
      const res = await createBooking(bookingData);
      console.log("API Response:", res.data?.message);

      // Check if message exists and show it
      if (res.data?.message) {
        showSnackbar(res.data.message, "success");
        // Remove the booked vehicle locally
        setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
      } else {
        showSnackbar("Booking confirmed!", "success");
      }
    } catch (err) {
      console.error("Booking error:", err);
      showSnackbar(
        err.response?.data?.message || "Error booking vehicle",
        "error"
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          p: 10,
          display: "flex",
          flexWrap: "wrap",
          gap: 5,
          borderRadius: 5,
        }}
      >
        {vehicles?.map((vehicle) => (
          <Card key={vehicle._id}>
            <CardContent>
              <Typography variant="h6">{vehicle.name}</Typography>
              <Typography>Capacity: {vehicle.capacityKg} KG</Typography>
              <Typography>Tyres: {vehicle.tyres}</Typography>
              <Typography>
                Estimated Ride Duration: {vehicle.estimatedRideDurationHours}{" "}
                hrs
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                type="button"
                size="small"
                variant="contained"
                color="primary"
                onClick={() => handleBook(vehicle._id)}
              >
                Book Now
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            fontWeight: "bold",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
