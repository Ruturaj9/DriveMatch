import { useState, useEffect } from "react";
import { CompareContext } from "./compareContext";

export const CompareProvider = ({ children }) => {
  const [rooms, setRooms] = useState(() => {
    try {
      const saved = localStorage.getItem("compareRooms");
      return saved
        ? JSON.parse(saved)
        : { 1: [], 2: [], 3: [], 4: [], 5: [] };
    } catch (error) {
      console.error("⚠️ Error reading compareRooms from localStorage:", error);
      return { 1: [], 2: [], 3: [], 4: [], 5: [] };
    }
  });

  // ✅ Sync with localStorage whenever rooms update
  useEffect(() => {
    localStorage.setItem("compareRooms", JSON.stringify(rooms));
  }, [rooms]);

  // ✅ Add vehicle to a specific room
  const addVehicleToRoom = (roomNumber, vehicle) => {
    if (!vehicle || !vehicle._id) return;
    setRooms((prev) => {
      const updated = structuredClone(prev);
      if (!updated[roomNumber].some((v) => v._id === vehicle._id)) {
        updated[roomNumber].push(vehicle);
      }
      return updated;
    });
  };

  // ✅ Remove vehicle by ID
  const removeVehicleFromRoom = (roomNumber, id) => {
    setRooms((prev) => {
      const updated = structuredClone(prev);
      updated[roomNumber] = updated[roomNumber].filter((v) => v._id !== id);
      return updated;
    });
  };

  // ✅ Clear an entire room
  const clearRoom = (roomNumber) => {
    setRooms((prev) => {
      const updated = structuredClone(prev);
      updated[roomNumber] = [];
      return updated;
    });
  };

  return (
    <CompareContext.Provider
      value={{
        rooms,
        addVehicleToRoom,
        removeVehicleFromRoom,
        clearRoom,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
