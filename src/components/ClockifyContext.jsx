
"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';

const ClockifyContext = createContext();

export function useClockify() {
  return useContext(ClockifyContext);
}

export function ClockifyProvider({ children }) {
  const [clockifyUserData, setClockifyUserData] = useState(null);

  // Load data from cookies on initial render
  useEffect(() => {
    const storedData = Cookies.get('clockifyUserData');
    if (storedData) {
      try {
        setClockifyUserData(JSON.parse(storedData));
      } catch (error) {
        console.error('Error parsing stored Clockify user data:', error);
      }
    }
  }, []);

  // Store data in cookies whenever it changes
  useEffect(() => {
    if (clockifyUserData) {
      Cookies.set('clockifyUserData', JSON.stringify(clockifyUserData), { 
        expires: 7, //so thtat cookie expires in 7 days
      });
    } else {
      // Remove cookie if data is null
      Cookies.remove('clockifyUserData');
    }
  }, [clockifyUserData]);

  return (
    <ClockifyContext.Provider value={{ clockifyUserData, setClockifyUserData }}>
      {children}
    </ClockifyContext.Provider>
  );
}