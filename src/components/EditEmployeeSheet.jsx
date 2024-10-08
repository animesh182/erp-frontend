"use client";
import React, { useEffect, useState } from "react";
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
import { getRoles, getLevels } from "@/app/api/employees/getEmployees";
export function EditEmployeeSheet({
  isOpen,
  onClose,
  employeeData,
  onEditEmployee,
  onAddEmployee,
}) {
  const [roles, setRoles] = useState();
  const [levels, setLevels] = useState();
  const {
    getValues,
    watch,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: employeeData || {},
  });
  useEffect(() => {
    const getRolesFromApi = async () => {
      try {
        const { status, data } = await getRoles();
        if (status === 200) {
          setRoles(data);
        } else {
          console.error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    getRolesFromApi();
  }, []);
  useEffect(() => {
    const getLevelsFromApi = async () => {
      try {
        const { status, data } = await getLevels();
        if (status === 200) {
          setLevels(data);
        } else {
          console.error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    getLevelsFromApi();
  }, []);
  console.log(employeeData, "ed");

  // useEffect(() => {
  //   if (employeeData) {
  //     console.log(watch(), "edit");
  //   } else {
  //     console.log(watch(), "add");
  //   }
  // }, [watch()]);
  React.useEffect(() => {
    if (isOpen) {
      if (employeeData) {
        reset({
          employeeId: employeeData.employee_id,
          dateOfBirth: employeeData.date_of_birth,
          gender: employeeData.gender,
          maritalStatus: employeeData.marital_status,
          startDate: employeeData.start_date || null,
          endDate: employeeData.end_date || null,
          country: employeeData.country,
          phone: employeeData.phone_number,
          email: employeeData.email,
          linkedInName: employeeData.linkedin_name,
          linkedInUrl: employeeData.linkedin_url,
          // jobTitle:  employeeData.,
          role: employeeData.role,
          level: employeeData.level,
          department: employeeData.department,
          employeeType: employeeData.employment_type,
          supervisor: employeeData.supervisor || null,
          salary: employeeData.salary,
          panNumber: employeeData.PAN,
        });
      } else {
        reset({
          employeeId: "",
          dateOfBirth: null,
          gender: "",
          maritalStatus: "",
          startDate: null,
          endDate: null,
          country: "",
          phone: "",
          email: "",
          linkedInName: "",
          linkedInUrl: "",
          // jobTitle: "",
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

  console.log(watch());
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
                    <SelectValue className="capitalize">
                      {field.value ? field.value : "Select Gender"}{" "}
                      {/* Show the selected gender */}
                    </SelectValue>{" "}
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
              {renderField("startDate", DatePicker, { required: true })}
              {renderField("endDate", DatePicker, { required: false })}
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
              {/* {renderField("jobTitle", Input, { required: true })} */}
              {renderField("role", Select, {
                required: true,

                children: roles
                  ? roles.map((role, index) => (
                      <SelectItem key={index} value={role.id}>
                        {role.title}
                      </SelectItem>
                    ))
                  : null,
              })}

              {renderField("level", Select, {
                required: true,
                children: levels
                  ? levels.map((level) => {
                      return (
                        <SelectItem key={level.id} value={String(level.id)}>
                          {level.description}
                        </SelectItem>
                      );
                    })
                  : null,
              })}
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
