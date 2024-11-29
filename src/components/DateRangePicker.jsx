

"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MonthRangePicker } from "@/components/MonthRangePicker";

export default function DateRangePicker({
  className,
  onDateChange,
  initialStartDate,
  initialEndDate,
  isMonthPicker = true,
}) {
  const [date, setDate] = React.useState({
    from: initialStartDate ? new Date(initialStartDate) : null,
    to: initialEndDate ? new Date(initialEndDate) : null,
  });

  React.useEffect(() => {
    setDate({
      from: initialStartDate ? new Date(initialStartDate) : null,
      to: initialEndDate ? new Date(initialEndDate) : null,
    });
  }, [initialStartDate, initialEndDate]);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    if (selectedDate?.from && selectedDate?.to) {
      onDateChange(selectedDate.from, selectedDate.to);
    }
  };

  const handleMonthRangeSelect = (range) => {
    const selectedDate = {
      from: range.start,
      to: range.end,
    };
    setDate(selectedDate);
    onDateChange(range.start, range.end);
  };


  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, isMonthPicker ? "MMM yyyy" : "LLL dd, y")}{" "}
                  - {format(date.to, isMonthPicker ? "MMM yyyy" : "LLL dd, y")}
                </>
              ) : (
                format(date.from, isMonthPicker ? "MMM yyyy" : "LLL dd, y")
              )
            ) : (
              <span>Pick a {isMonthPicker ? "month" : "date"}</span>
            )}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {isMonthPicker ? (
            <MonthRangePicker
              selectedMonthRange={{
                start: date?.from || new Date(),
                end: date?.to || new Date(),
              }}
              onMonthRangeSelect={handleMonthRangeSelect}
              minDate={new Date(2020, 0)}
              maxDate={new Date(2025, 11)}
            />
          ) : (
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={1}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}