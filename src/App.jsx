import { useState } from "react";
import AddVehiclePage from "./components/AddVehicleForm";
import SearchBookForm from "./components/SearchBookForm";
import { Box } from "@mui/material";
import VehiclesList from "./components/VehiclesList";

function App() {
  const [vehicles, setVehicles] = useState(null);
  const [fromPincode, setFromPincode] = useState("");
  const [toPincode, setToPincode] = useState("");
  const [startTime, setStartTime] = useState(null);

  const getVechile = (v, fromPincode, toPincode, startTime) => {
    setVehicles(v);
    setFromPincode(fromPincode);
    setToPincode(toPincode);
    setStartTime(startTime);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", 
          alignItems: "center", 
          paddingLeft:60,
        }}
      >
        <AddVehiclePage />
        <SearchBookForm propsVechiles={getVechile} />
      </Box>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <VehiclesList
          vehicles={vehicles}
          startTime={startTime}
          fromPincode={fromPincode}
          toPincode={toPincode}
        />
      </div>
    </>
  );
}

export default App;
