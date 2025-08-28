import { useState } from "react";
import { addVehicle } from "../api/api";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";

export default function AddVehicleForm() {
  const [name, setName] = useState("");
  const [capacityKg, setCapacityKg] = useState("");
  const [tyres, setTyres] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const SlideTransition = (props) => {
    return <Slide {...props} direction="down" />;
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showSnackbar("Loading...", "info");
    try {
      const res = await addVehicle({
        name,
        capacityKg: Number(capacityKg),
        tyres: Number(tyres),
      });
      showSnackbar(`Vehicle added: ${res.data.message}`, "success");
      setName("");
      setCapacityKg("");
      setTyres("");
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Error adding vehicle",
        "error"
      );
    }
  };

  return (
    <>
      <Paper sx={{ padding: 4, width: "40%", mb: 9 }}>
        <Typography variant="h4" gutterBottom align="center">
          Add Vehicle
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Vehicle Name"
            variant="outlined"
            type="text"
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[a-zA-Z\s]*$/.test(value)) {
                setName(value);
              }
            }}
            required
          />

          <TextField
            label="Capacity (KG)"
            type="number"
            variant="outlined"
            value={capacityKg}
            onChange={(e) => setCapacityKg(e.target.value)}
            required
          />
          <TextField
            label="Number of Tyres"
            type="number"
            variant="outlined"
            value={tyres}
            onChange={(e) => setTyres(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Add Vehicle
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
    </>
  );
}
