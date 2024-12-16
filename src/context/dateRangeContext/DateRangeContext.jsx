"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';
import { startOfMonth, format } from 'date-fns';

export const DateRangeContext = createContext();

export const DateRangeProvider = ({ children }) => {
    const initialEndDate = new Date();
    const initialStartDate = startOfMonth(initialEndDate);
    const [isClient, setIsClient] = useState(false);
    
    const [startDate, setStartDate] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedStartDate = sessionStorage.getItem('startDate');
            return storedStartDate ? new Date(storedStartDate) : initialStartDate;
        }
        return initialStartDate;
    });

    const [endDate, setEndDate] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedEndDate = sessionStorage.getItem('endDate');
            return storedEndDate ? new Date(storedEndDate) : initialEndDate;
        }
        return initialEndDate;
    });

    useEffect(() => {
        setIsClient(true);
        sessionStorage.setItem('startDate', startDate.toISOString());
        sessionStorage.setItem('endDate', endDate.toISOString());
    }, [startDate, endDate]);

    const updateDateRange = (newStartDate, newEndDate) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    const contextValue = isClient 
        ? { startDate, endDate, setStartDate, setEndDate, updateDateRange }
        : { 
            startDate: initialStartDate, 
            endDate: initialEndDate, 
            setStartDate, 
            setEndDate, 
            updateDateRange 
        };

    return (
        <DateRangeContext.Provider value={contextValue}>
            {children}
        </DateRangeContext.Provider>
    );
};

export const useDateRange = () => {
    const context = useContext(DateRangeContext);
    
    if (!context) {
        throw new Error('useDateRange must be used within a DateRangeProvider');
    }
    
    return context;
};