"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { differenceInCalendarDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export function RequestForLeaveSheet({ isOpen, onClose, onSubmit,data }) {
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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [others, setOthers] = useState("");
  const [leaveReason, setLeaveReason] = useState("Sick leave (Illness or Injury)");

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
    const newLeaveRequest = { ...data, status: "Pending" };
    onSubmit(newLeaveRequest);
    reset(); // Reset the form after submission
    setOthers();
    onClose(); // Close the sheet

  
  };
 
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="">
        <SheetHeader className="text-left">
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
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            {leaveReason === "Other" ? (others || "Specify your leave reason") : leaveReason}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-4 w-full space-y-2 max-h-52 overflow-y-auto">
          {data?.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setLeaveReason(item.name);
                field.onChange(item.name);
                setIsPopoverOpen(false);
              }}
              className="cursor-pointer"
            >
              {item.name}
            </div>
          ))}
          <div
            onClick={() => {
              setLeaveReason("Other");
              field.onChange("Other");
              setIsPopoverOpen(true); // Keep Popover open for input
            }}
            className="cursor-pointer"
          >
            Other
          </div>
          {leaveReason === "Other" && (
            <Input
              placeholder="Specify your leave reason"
              value={others}
              onChange={(e) => {
                setOthers(e.target.value);
                field.onChange(e.target.value);
              }}
              className="mt-2"
            />
          )}
        </PopoverContent>
      </Popover>
    )}
  />
</div>

          {/* Date Range (From - To) */}
          <div className="grid grid-cols-2 gap-4 z-0">
            {/* <div>
              <label className="text-sm font-medium">From</label>
              <Controller
                name="startedLeaveDate"
                control={control}
                  rules={{ required: "Start date is required" }}
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
                rules={{ required: "End date is required" }}
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
            </div> */}
            <div>
  <label className="text-sm font-medium">From</label>
  <Controller
    name="startedLeaveDate"
    control={control}
    rules={{ required: "Start date is required" }}
    render={({ field, fieldState }) => (
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                fieldState.invalid ? "border-destructive" : ""
              }`}
            >
              {field.value ? format(field.value, "MMM dd yyyy") : "Pick a date"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
          </PopoverContent>
        </Popover>
        {fieldState.error && (
          <p className="text-destructive text-sm mt-1">{fieldState.error.message}</p>
        )}
      </>
    )}
  />
</div>

<div>
  <label className="text-sm font-medium">To</label>
  <Controller
    name="endedLeaveDate"
    control={control}
    rules={{ required: "End date is required" }}
    render={({ field, fieldState }) => (
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                fieldState.invalid ? "border-destructive" : ""
              }`}
            >
              {field.value ? format(field.value, "MMM dd yyyy") : "Pick a date"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
          </PopoverContent>
        </Popover>
        {fieldState.error && (
          <p className="text-destructive text-sm mt-1">{fieldState.error.message}</p>
        )}
      </>
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {field.value || "Select Type"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full justify-start">
                    <div onClick={() => field.onChange("Full Day")} className="cursor-pointer p-2">
                      Full Day
                    </div>
                    <div onClick={() => field.onChange("AM")} className="cursor-pointer p-2">
                      AM
                    </div>
                    <div onClick={() => field.onChange("PM")} className="cursor-pointer p-2">
                      PM
                    </div>
                  </PopoverContent>
                </Popover>
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