"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DatePicker({ value, onChange, minDate, disabled }) {
  const [date, setDate] = React.useState(value ? new Date(value) : null);
  const [year, setYear] = React.useState(
    date ? date.getFullYear() : new Date().getFullYear()
  );
  const [month, setMonth] = React.useState(
    date ? date.getMonth() : new Date().getMonth()
  );

  React.useEffect(() => {
    const newDate = value ? new Date(value) : null;
    setDate(newDate);
    if (newDate) {
      setYear(newDate.getFullYear());
      setMonth(newDate.getMonth());
    }
  }, [value]);

  const handleDateChange = (selectedDate) => {
    if (!selectedDate) {
      setDate(null);
      setYear(new Date().getFullYear());
      setMonth(new Date().getMonth());
      onChange(null);
      return;
    }

    const adjustedDate = new Date(selectedDate.setHours(12, 0, 0, 0));
    let formattedDate;

    if (minDate && adjustedDate < new Date(minDate).setHours(12, 0, 0, 0)) {
      const minDateAdjusted = new Date(minDate).setHours(12, 0, 0, 0);
      formattedDate = format(minDateAdjusted, "yyyy-MM-dd");
      setDate(new Date(minDateAdjusted));
    } else {
      formattedDate = format(adjustedDate, "yyyy-MM-dd");
      setDate(adjustedDate);
    }

    setYear(adjustedDate.getFullYear());
    setMonth(adjustedDate.getMonth());
    onChange(formattedDate);
  };

  const handleYearChange = (increment) => {
    const newYear = year + increment;
    setYear(newYear);
    if (date) {
      const newDate = new Date(date.setFullYear(newYear));
      handleDateChange(newDate);
    }
  };

  const handleYearChangeSelect = (value) => {
    handleYearChange(parseInt(value) - year);
  };

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal relative",
            !date && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50"
          )}
          disabled={disabled}
        >
          <div className="flex items-center w-full">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            {date && !disabled && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-6 w-6 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDateChange(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col space-y-2 p-2">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleYearChange(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Select
                value={year.toString()}
                onValueChange={handleYearChangeSelect}
              >
                <SelectTrigger className="h-7 w-[120px]">
                  <SelectValue placeholder={year} />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="max-h-[300px] overflow-y-auto"
                >
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleYearChange(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              month={new Date(year, month)}
              onMonthChange={(newMonth) => {
                setMonth(newMonth.getMonth());
                setYear(newMonth.getFullYear());
              }}
              initialFocus
              disabled={(date) =>
                minDate ? date < new Date(minDate).setHours(0, 0, 0, 0) : false
              }
            />
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
