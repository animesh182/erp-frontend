import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CustomSheetTitle from "@/components/CustomSheetTitle";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn, prettifyText } from "@/lib/utils";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function EditEmployeeSheet({
  isOpen,
  onClose,
  employeeData,
  onEditEmployee,
  onAddEmployee,
  roleOptions,
  levelOptions,
}) {
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [initialValues, setInitialValues] = React.useState({});

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

  // Function to check if form values have changed
  const hasFormChanged = React.useCallback(() => {
    const currentValues = getValues();
    return Object.keys(currentValues).some((key) => {
      // Handle null/undefined cases
      const initial = initialValues[key] ?? "";
      const current = currentValues[key] ?? "";

      // Convert dates to comparable strings
      if (current instanceof Date) {
        return initial?.toISOString() !== current.toISOString();
      }

      return initial !== current;
    });
  }, [getValues, initialValues]);

  React.useEffect(() => {
    if (isOpen) {
      const defaults = employeeData
        ? {
            employeeId: employeeData.employee_id,
            dateOfBirth: employeeData.date_of_birth,
            gender: employeeData.gender,
            maritalStatus: employeeData.marital_status,
            fullName: employeeData.full_name,
            startDate: employeeData.start_date,
            endDate: employeeData.end_date,
            country: employeeData.country,
            phone: employeeData.phone_number,
            email: employeeData.email,
            linkedInName: employeeData.linkedin_name,
            linkedInUrl: employeeData.linkedin_url,
            jobTitle: employeeData.role,
            level: employeeData.level,
            department: employeeData.department,
            employeeType: employeeData.employment_type,
            supervisor: employeeData.supervisor,
            salary: employeeData.salary,
            panNumber: employeeData.pan_number,
          }
        : {
            employeeId: "",
            dateOfBirth: null,
            gender: "",
            maritalStatus: "",
            fullName: "",
            startDate: null,
            endDate: null,
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
          };

      setInitialValues(defaults);
      reset(defaults);
    }
  }, [isOpen, employeeData, reset]);

  const handleClose = () => {
    if (hasFormChanged()) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    reset(initialValues);
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  const onSubmit = (data) => {
    if (employeeData) {
      onEditEmployee(data);
    } else {
      onAddEmployee(data);
    }
    setInitialValues(data);
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
                      {field.value
                        ? field.value
                        : `Select ${prettifyText(name)}`}
                    </SelectValue>
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
    <>
      <Sheet open={isOpen} onOpenChange={handleClose}>
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
                {renderField("fullName", Input, { required: true })}

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
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
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
                {renderField("linkedInUrl", Input)}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Employment Details</h3>
              <div className="space-y-4">
                {renderField("jobTitle", Select, {
                  required: true,
                  children: (
                    <>
                      {roleOptions?.map((role) => (
                        <SelectItem key={role.id} value={role.title}>
                          {role.title}
                        </SelectItem>
                      ))}
                    </>
                  ),
                })}
                {renderField("level", Select, {
                  required: true,
                  children: (
                    <>
                      {levelOptions?.map((level) => (
                        <SelectItem key={level.id} value={level.description}>
                          {level.description}
                        </SelectItem>
                      ))}
                    </>
                  ),
                })}
                {renderField("department", Input, { required: true })}
                {renderField("employeeType", Select, {
                  required: true,
                  children: (
                    <>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                    </>
                  ),
                })}
                {renderField("supervisor", Input, { required: false })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Compensation & Benefits</h3>
              <div className="space-y-4">
                {renderField("salary", Input, {
                  type: "number",
                  required: true,
                })}
                {renderField("panNumber", Input, { required: true })}
              </div>
            </div>

            <Button type="submit">
              {employeeData ? "Save Changes" : "Add Employee"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close without
              saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClose}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              Close without saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
