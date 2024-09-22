"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import CustomSheetTitle from "@/components/CustomSheetTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/DatePicker";
import { prettifyText, cn } from "@/lib/utils";
import { toast } from "sonner";

export function EditEmployeeSheet({
  isOpen,
  onClose,
  employeeData,
  onEditEmployee,
  onAddEmployee,
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: employeeData || {},
  });

  React.useEffect(() => {
    if (isOpen) {
      if (employeeData) {
        reset(employeeData);
      } else {
        reset({
          employeeId: "",
          dateOfBirth: null,
          gender: "",
          maritalStatus: "",
          country: "",
          phone: "",
          email: "",
          linkedInName: "",
          linkedInUrl: "",
          jobTitle: "",
          level: "",
          department: "",
          employeeType: "",
          supervisor: "",
          salary: "",
          panNumber: "",
        });
      }
    }
  }, [isOpen, employeeData, reset]);

  const onSubmit = (data) => {
    if (employeeData) {
      onEditEmployee(data);
    } else {
      onAddEmployee(data);
    }
    reset();
    onClose();
  };

  const onError = (errors) => {
    console.error(errors);
    toast.error("Please fill in all required fields correctly.");
  };

  const renderField = (name, Component, props = {}) => {
    const hasError = errors[name];

    return (
      <div key={name} className="space-y-1">
        <label htmlFor={name} className="text-sm font-medium">
          {prettifyText(name)}
        </label>
        <Controller
          name={name}
          control={control}
          rules={{ required: props.required }}
          render={({ field }) => {
            if (Component === Select) {
              return (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  className={cn(hasError && "ring-2 ring-red-500")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${prettifyText(name)}`} />
                  </SelectTrigger>
                  <SelectContent>{props.children}</SelectContent>
                </Select>
              );
            }
            if (Component === DatePicker) {
              return (
                <Component
                  {...field}
                  {...props}
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  ref={null}
                  className={cn(
                    props?.className,
                    hasError && "ring-2 ring-red-500"
                  )}
                />
              );
            }
            return (
              <Component
                {...field}
                {...props}
                value={field.value || ""}
                className={cn(
                  props?.className,
                  hasError && "ring-2 ring-red-500"
                )}
              />
            );
          }}
        />
        {hasError && (
          <p className="text-sm text-red-500">{errors[name].message}</p>
        )}
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <CustomSheetTitle
          title={employeeData ? "Edit Employee" : "Add Employee"}
        />
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="space-y-6 mt-4"
        >
          <div>
            <h3 className="font-semibold mb-2">Basic Details</h3>
            <div className="space-y-4">
              {renderField("employeeId", Input, { required: true })}
              {renderField("dateOfBirth", DatePicker, { required: true })}
              {renderField("gender", Select, {
                required: true,
                children: (
                  <>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </>
                ),
              })}
              {renderField("maritalStatus", Select, {
                required: true,
                children: (
                  <>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </>
                ),
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <div className="space-y-4">
              {renderField("country", Input, { required: true })}
              {renderField("phone", Input, { required: true })}
              {renderField("email", Input, { required: true })}
              {renderField("linkedInName", Input)}
              {renderField("linkedInUrl", Input)}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Employment Details</h3>
            <div className="space-y-4">
              {renderField("jobTitle", Input, { required: true })}
              {renderField("level", Input, { required: true })}
              {renderField("department", Input, { required: true })}
              {renderField("employeeType", Select, {
                required: true,
                children: (
                  <>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Intern">Intern</SelectItem>
                  </>
                ),
              })}
              {renderField("supervisor", Input, { required: true })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Compensation & Benefits</h3>
            <div className="space-y-4">
              {renderField("salary", Input, { type: "number", required: true })}
              {renderField("panNumber", Input, { required: true })}
            </div>
          </div>

          <Button type="submit">
            {employeeData ? "Save Changes" : "Add Employee"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
