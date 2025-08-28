import { useState } from "react";
import { getAvailableVehicles, createBooking } from "../api/api";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Snackbar,
  Slide,
} from "@mui/material";

import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function SearchBookForm({ propsVechiles }) {
  const [capacityRequired, setCapacityRequired] = useState("");
  const [fromPincode, setFromPincode] = useState("");
  const [toPincode, setToPincode] = useState("");
  const [startTime, setStartTime] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const SlideTransition = (props) => {
    return <Slide {...props} direction="down" />;
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  console.log("cappap", startTime);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!startTime) {
      return showSnackbar("Please fill all required fields", "error");
    }

    try {
      const res = await getAvailableVehicles({
        capacityRequired: Number(capacityRequired),
        fromPincode,
        toPincode,
        startTime: startTime.toISOString(),
      });

      const { vehicles = [], estimatedRideDurationHours, message } = res.data;

      // if API sent a message but no vehicles
      if (message && vehicles.length === 0) {
        setVehicles([]);
        setSeverity("info");
        return showSnackbar(message, "error");
      }

      // add duration to all vehicles
      const vehiclesWithDuration = vehicles.map((v) => ({
        ...v,
        estimatedRideDurationHours,
      }));

      setVehicles(vehiclesWithDuration);
      propsVechiles(vehiclesWithDuration, fromPincode, toPincode, startTime);

      // show snackbar based on result
      if (!vehiclesWithDuration.length) {
        setSeverity("info");
        showSnackbar(
          "No vehicles available for the selected criteria.",
          "info"
        );
      } else {
        setSeverity("success");
        showSnackbar(
          `Found ${vehiclesWithDuration.length} available vehicles.`,
          "success"
        );
      }
    } catch (err) {
      setVehicles([]);
      setSeverity("error");
      showSnackbar(
        err.response?.data?.message || "Error fetching vehicles",
        "error"
      );
    }
  };

  return (
    <>
      <Container>
        <Paper sx={{ padding: 4, width: "40%" }}>
          <Typography variant="h4" gutterBottom align="center">
            Search & Book Vehicle
          </Typography>
          {message && (
            <Alert severity={severity} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          {/* Search Form */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Capacity Required (KG)"
              type="number"
              value={capacityRequired}
              onChange={(e) => setCapacityRequired(e.target.value)}
              required
            />
            <TextField
              label="From Pincode"
              value={fromPincode}
              onChange={(e) => setFromPincode(e.target.value)}
              required
            />
            <TextField
              label="To Pincode"
              value={toPincode}
              onChange={(e) => setToPincode(e.target.value)}
              required
            />
            <LocalizationProvider required dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start Time"
                value={startTime ? dayjs(startTime) : null}
                onChange={(newValue) => setStartTime(newValue)}
                renderInput={(params) => <TextField {...params} required />}
              />
            </LocalizationProvider>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Search Vehicle
            </Button>
          </Box>
        </Paper>

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
      </Container>
    </>
  );
}
