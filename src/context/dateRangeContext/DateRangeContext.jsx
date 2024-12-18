
"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { startOfMonth } from "date-fns";

export const DateRangeContext = createContext();

export const DateRangeProvider = ({ children }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        // Ensure this runs after hydration
        const storedStartDate = sessionStorage.getItem("startDate");
        const storedEndDate = sessionStorage.getItem("endDate");

        const currentEndDate = new Date();
        const currentStartDate = startOfMonth(currentEndDate);

        setStartDate(storedStartDate ? new Date(storedStartDate) : currentStartDate);
        setEndDate(storedEndDate ? new Date(storedEndDate) : currentEndDate);
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            sessionStorage.setItem("startDate", startDate.toISOString());
            sessionStorage.setItem("endDate", endDate.toISOString());
        }
    }, [startDate, endDate]);

    const updateDateRange = (newStartDate, newEndDate) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    // Render children only when dates are initialized
    if (!startDate || !endDate) return null;

    return (
        <DateRangeContext.Provider value={{ startDate, endDate, setStartDate, setEndDate, updateDateRange }}>
            {children}
        </DateRangeContext.Provider>
    );
};

export const useDateRange = () => {
    const context = useContext(DateRangeContext);
    if (!context) {
        throw new Error("useDateRange must be used within a DateRangeProvider");
    }
    return context;
};
