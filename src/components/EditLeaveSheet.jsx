


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

export function RequestForLeaveSheet({ isOpen, onClose, onSubmit, data }) {
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      leaveReason: "Sick leave (Illness or Injury)",
      startedLeaveDate: null,
      endedLeaveDate: null,
      typeOfLeave: "Full Day",
      detailedExplanation: "",
      numberOfLeaveDays: 0,
      otherReason: "", // New field for other reason
    },
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [leaveReason, setLeaveReason] = useState("Sick leave (Illness or Injury)");

  const startDate = watch("startedLeaveDate");
  const endDate = watch("endedLeaveDate");
  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1;
      setValue("numberOfLeaveDays", days > 0 ? days : 0);
    }
  }, [startDate, endDate, setValue]);

  const handleFormSubmit = (data) => {
    const newLeaveRequest = {
      ...data,
      status: "Pending",
      // Use otherReason as the leaveReason if "Other" is selected
      leaveReason: leaveReason === "Other" ? data.otherReason : data.leaveReason,
    };
    onSubmit(newLeaveRequest);
    reset();
    onClose();
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
                      {leaveReason === "Other" ? "Other" : leaveReason}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-4 w-full space-y-0 max-h-72 overflow-y-auto">
                    {data?.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setLeaveReason(item.name);
                          field.onChange(item.name);
                          setIsPopoverOpen(false);
                        }}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                      >
                        {item.name}
                      </div>
                    ))}
                    <div
                      onClick={() => {
                        setLeaveReason("Other");
                        field.onChange("Other");
                        setIsPopoverOpen(false);
                      }}
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                    >
                      Other
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          {/* Other Reason Input - Only shown when "Other" is selected */}
          {leaveReason === "Other" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Specify Leave Reason</label>
              <Controller
                name="otherReason"
                control={control}
                rules={{ required: leaveReason === "Other" }}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      placeholder="Please specify your leave reason"
                      className={fieldState.error ? "border-destructive" : ""}
                      {...field}
                    />
                    {fieldState.error && (
                      <p className="text-destructive text-sm">Please specify your leave reason</p>
                    )}
                  </>
                )}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 z-0">
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
                    <div onClick={() => field.onChange("Full Day")} className="cursor-pointer p-2 hover:bg-gray-100">
                      Full Day
                    </div>
                    <div onClick={() => field.onChange("AM")} className="cursor-pointer p-2 hover:bg-gray-100">
                      AM
                    </div>
                    <div onClick={() => field.onChange("PM")} className="cursor-pointer p-2 hover:bg-gray-100">
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

          {/* Number of Leave Days */}
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