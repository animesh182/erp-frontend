"use client"
import React, { createContext, useContext, useEffect, useState } from "react";

const ClockifyContext = createContext();

export function useClockify() {
  return useContext(ClockifyContext);
}

export function ClockifyProvider({ children }) {
  const [clockifyUserData, setClockifyUserData] = useState(null);


  useEffect(() => {
    const storedData = sessionStorage.getItem("clockifyUserData");
    if (storedData) {
      setClockifyUserData(JSON.parse(storedData)); // Retrieve and set the data
    }
  }, []);

  // Store data in sessionStorage whenever it changes
  useEffect(() => {
    if (clockifyUserData) {
      sessionStorage.setItem("clockifyUserData", JSON.stringify(clockifyUserData));
    }
  }, [clockifyUserData]);
  return (
    <ClockifyContext.Provider value={{ clockifyUserData, setClockifyUserData }}>
      {children}
    </ClockifyContext.Provider>
  );
}
