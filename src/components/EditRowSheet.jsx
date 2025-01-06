"use client";
import { prettifyText, cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import CustomSheetTitle from "@/components/CustomSheetTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/DatePicker";
import { toast } from "sonner";
import { ProjectSelect } from "./ProjectSelect";

export function EditRowSheet({
  isOpen,
  onClose,
  rowData,
  formInputs,
  onEditRow,
}) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors,isValid  },
  } = useFormContext();


  const invoiceIssuedDate = watch("invoiceIssuedDate");
  const status = watch("status");

  useEffect(() => {
    if (isOpen && rowData) {
      const defaultValues = formInputs.reduce((acc, input) => {
        if (input.name && input.name !== "actions") {
          acc[input.name] = rowData[input.name] || "";
        }
        return acc;
      }, {});
      reset(defaultValues);
    }
  }, [isOpen, rowData, formInputs, reset]);

  const onSubmit = (data) => {
    // Assuming `rowData` contains the current row being edited
    const editedDataWithId = {
      ...data,
      id: rowData.id, // Ensure the invoice ID is included in the edited data
    };

    if (typeof onEditRow === "function") {
      onEditRow(editedDataWithId); // Pass the data with the ID to onEditRow
    } else {
      console.error("onEditRow is not a function");
      toast.error("Failed to update row. Please try again.");
    }
    onClose();
  };

  const onError = (errors) => {
    console.error(errors);
    toast.error("Please fill in all required fields correctly.");
  };

  const renderFormField = (field) => {
    if (!field.component) {
      console.error(`Component for field ${field.name} is undefined`);
      return null;
    }

    const Component = field.component.type;
    const hasError = errors[field.name];

    // if (field.name !== "actions") {
    //   if (Component === Input) {
    //     return (
    //       <Controller
    //         name={field.name}
    //         control={control}
    //         rules={{ required: field.required }}
    //         render={({ field: { onChange, value } }) => (
    //           <Input
    //             {...field.component.props}
    //             value={value || ""}
    //             onChange={onChange}
    //             className={cn(
    //               field.component.props?.className,
    //               hasError && "ring-2 ring-red-500"
    //             )}
    //           />
    //         )}
    //       />
    //     );
    //   }
    if (field.name !== "actions") {
      if (Component === Input) {
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: { onChange, value } }) => (
              <Input
                {...field.component.props}
                value={value || ""}
                onChange={(e) => {
                  // If the input type is number, handle floating point
                  if (field.component.props?.type === "number") {
                    const numberValue = e.target.value === "" ? "" : parseFloat(e.target.value);
                    onChange(numberValue);
                  } else {
                    onChange(e);
                  }
                }}
                // Allow decimal point input for number fields
                step={field.component.props?.type === "number" ? "any" : undefined}
                className={cn(
                  field.component.props?.className,
                  hasError && "ring-2 ring-red-500"
                )}
              />
            )}
          />
        );
      }

      if (field.name === "projectName") {
        return (
          <Controller
            control={control}
            name={field.name}
            rules={{ required: field.required }}
            render={({ field: { onChange, value} }) => (
              <ProjectSelect
                value={value}
                onChange={onChange}
                className={cn(hasError && "ring-2 ring-red-500")}
              />
            )}
          />
        );
      }

      if (field.name === "paidDate") {
        return (
          <Controller
            control={control}
            name={field.name}
            rules={{ required: field.required && status === "Paid" }}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                {...field.component.props}
                value={value ? new Date(value) : null}
                onChange={(date) => onChange(date ? date : null)}
                className={cn(
                  field.component.props?.className,
                  hasError && "ring-2 ring-red-500"
                )}
                disabled={status !== "Paid"}
                minDate={
                  invoiceIssuedDate ? new Date(invoiceIssuedDate) : undefined
                }
              />
            )}
          />
        );
      }

      if (Component === DatePicker) {
        return (
          <Controller
            control={control}
            name={field.name}
            rules={{ required: field.required }}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                {...field.component.props}
                value={value ? new Date(value) : null}
                onChange={(date) => onChange(date ? date : null)}
                className={cn(
                  field.component.props?.className,
                  hasError && "ring-2 ring-red-500"
                )}
              />
            )}
          />
        );
      }

      return (
        <Controller
          control={control}
          name={field.name}
          // rules={{ required: field.required }}
          rules={{
            required: field.required,
            validate: (value) => {
              console.log(value,"value")
              if (field.required && (value === null || value === undefined || value === "" || value==="N/A")) {
                return "This field is required";
              }
              return true;
            }
          }}
          render={({ field: { onChange, value } }) => (
            <Component
              {...field.component.props}
              value={value || ""}
              onValueChange={Component === Select ? onChange : undefined}
              className={cn(
                field.component.props?.className,
                hasError && "ring-2 ring-red-500"
              )}
            />
          )}
        />
      );
    }

    return null;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <CustomSheetTitle
          title="Edit Row"
          //   subtitle="Make changes to the row data here. Click save when you're done."
        />
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="space-y-4 mt-4"
        >
          {formInputs?.map((field, index) => {
            const prettyLabel = prettifyText(field.name);
            return (
              <div key={index} className="space-y-1">
                <label
                  htmlFor={field.name}
                  className={`text-sm font-medium ${
                    field.name === "actions" ? "sr-only" : ""
                  }`}
                >
                  {prettyLabel}
                </label>
                {renderFormField(field)}
                {/* {errors[field.name] && (
                  <p className="text-sm text-red-500">
                    {errors[field.name].message}
                  </p>
                )} */}
              </div>
            );
          })}
          <Button type="submit" disabled={!isValid} >Save Changes</Button>

        </form>
      </SheetContent>
    </Sheet>
  );
}

