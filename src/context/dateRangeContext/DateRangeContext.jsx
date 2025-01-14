
"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { startOfMonth } from "date-fns";

export const DateRangeContext = createContext();

export const DateRangeProvider = ({ children }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Ensure this runs after hydration
        const storedStartDate = sessionStorage.getItem("startDate");
        const storedEndDate = sessionStorage.getItem("endDate");

        const currentEndDate = new Date();
        const currentStartDate = startOfMonth(currentEndDate);

        setStartDate(storedStartDate ? new Date(storedStartDate) : currentStartDate);
        setEndDate(storedEndDate ? new Date(storedEndDate) : currentEndDate);
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized && startDate && endDate) {
            sessionStorage.setItem("startDate", startDate.toISOString());
            sessionStorage.setItem("endDate", endDate.toISOString());
        }
    }, [startDate, endDate, isInitialized]);

    const updateDateRange = (newStartDate, newEndDate) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    if (!isInitialized) return null;



    return (
        <DateRangeContext.Provider value={{ 
            startDate, 
            endDate, 
            updateDateRange,
            setStartDate, 
            setEndDate,
            hasDateFilter: Boolean(startDate && endDate)
        }}>
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
