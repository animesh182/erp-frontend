"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format, differenceInCalendarDays } from "date-fns";
import { CalendarIcon } from "lucide-react";

export function RequestForLeaveSheet({ isOpen, onClose, onSubmit }) {
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      leaveReason: "Sick leave (Illness or Injury)",
      startedLeaveDate: null,
      endedLeaveDate: null,
      typeOfLeave: "Full Day",
      detailedExplanation: "",
      numberOfLeaveDays: 0, // Adding number of leave days to the form
    },
  });

  // Watch for changes in start and end date to automatically calculate the number of days
  const startDate = watch("startedLeaveDate");
  const endDate = watch("endedLeaveDate");

  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1; // Adding 1 to include both start and end day
      setValue("numberOfLeaveDays", days > 0 ? days : 0); // Ensure no negative days
    }
  }, [startDate, endDate, setValue]);

  const handleFormSubmit = (data) => {
    // Set status as "Pending" when submitting
    const newLeaveRequest = {
      ...data,
      status: "Pending",
    };
    onSubmit(newLeaveRequest); // Call the parent function to handle form data
    reset(); // Reset the form after submission
    onClose(); // Close the sheet
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[480px]">
        <SheetHeader>
          <SheetTitle>Request for Leave</SheetTitle>
          <SheetDescription>
            Here you can request for leave by filling the form below.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-6">
          {/* Type of Leave */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type of Leave</label>
            <Controller
              name="leaveReason"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type of Leave" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sick leave (Illness or Injury)">Sick leave (Illness or Injury)</SelectItem>
                    <SelectItem value="Bereavement leave">Bereavement leave</SelectItem>
                    <SelectItem value="Vacation Leave">Vacation Leave</SelectItem>
                    <SelectItem value="Leave without pay">Leave without pay</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Date Range (From - To) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">From</label>
              <Controller
                name="startedLeaveDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        {field.value ? format(field.value, "MMM dd yyyy") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div>
              <label className="text-sm font-medium">To</label>
              <Controller
                name="endedLeaveDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        {field.value ? format(field.value, "MMM dd yyyy") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Controller
              name="typeOfLeave"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Day">Full Day</SelectItem>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Detailed Explanation */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Detailed Explanation</label>
            <Controller
              name="detailedExplanation"
              control={control}
              render={({ field }) => (
                <Textarea placeholder="Type your description here." {...field} className="min-h-[100px]" />
              )}
            />
          </div>

          {/* Automatically populated number of leave days */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Leave Days</label>
            <Controller
              name="numberOfLeaveDays"
              control={control}
              render={({ field }) => (
                <Input readOnly {...field} value={field.value || 0} />
              )}
            />
          </div>

          {/* Confirm Button */}
          <Button type="submit" className="w-full">
            Confirm
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
