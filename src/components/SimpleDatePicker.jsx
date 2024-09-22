"use client";
import * as React from "react";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

export function SimpleDatePicker({ value, onChange, minDate, disabled }) {
  const [inputValue, setInputValue] = React.useState(
    value ? format(new Date(value), "yyyy-MM-dd") : ""
  );

  // Sync internal state with the value prop when it changes (e.g., after a reset)
  React.useEffect(() => {
    setInputValue(value ? format(new Date(value), "yyyy-MM-dd") : "");
  }, [value]);

  const handleInputChange = (e) => {
    const inputDate = e.target.value;
    // console.log(inputDate, "inputDate");
    setInputValue(inputDate);

    try {
      const parsedDate = parse(inputDate, "yyyy-MM-dd", new Date());
      if (!isNaN(parsedDate.getTime())) {
        const adjustedDate = new Date(parsedDate.setHours(12, 0, 0, 0));
        let formattedDate;

        if (minDate && adjustedDate < new Date(minDate).setHours(12, 0, 0, 0)) {
          const minDateAdjusted = new Date(minDate).setHours(12, 0, 0, 0);
          formattedDate = format(minDateAdjusted, "yyyy-MM-dd");
        } else {
          formattedDate = format(adjustedDate, "yyyy-MM-dd");
        }

        onChange(formattedDate); // Pass the formatted date string to onChange
      }
    } catch (error) {
      // Invalid date format, do nothing
    }
  };

  return (
    <Input
      type="date"
      value={inputValue}
      onChange={handleInputChange}
      disabled={disabled}
      min={minDate}
      className={cn("w-full", disabled && "cursor-not-allowed opacity-50")}
    />
  );
}
