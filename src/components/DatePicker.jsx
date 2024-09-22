"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ value, onChange, minDate, disabled }) {
  const [date, setDate] = React.useState(value);

  // Sync internal state with the value prop when it changes (e.g., after a reset)
  React.useEffect(() => {
    setDate(value ? new Date(value) : null);
  }, [value]);

  const handleDateChange = (selectedDate) => {
    if (!selectedDate) return;

    const adjustedDate = new Date(selectedDate.setHours(12, 0, 0, 0));
    let formattedDate;

    if (minDate && adjustedDate < new Date(minDate).setHours(12, 0, 0, 0)) {
      const minDateAdjusted = new Date(minDate).setHours(12, 0, 0, 0);
      formattedDate = format(minDateAdjusted, "yyyy-MM-dd");
      setDate(minDateAdjusted);
    } else {
      formattedDate = format(adjustedDate, "yyyy-MM-dd");
      setDate(adjustedDate);
    }

    onChange(formattedDate); // Pass the formatted date string to onChange
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            defaultMonth={date || undefined}
            disabled={(date) =>
              minDate && date < new Date(minDate).setHours(12, 0, 0, 0)
            }
          />
        </PopoverContent>
      )}
    </Popover>
  );
}
