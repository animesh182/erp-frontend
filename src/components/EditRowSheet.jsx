"use client";
import { prettifyText, cn } from "@/lib/utils";
import React from "react";
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
    formState: { errors },
  } = useFormContext();

  React.useEffect(() => {
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
    if (typeof onEditRow === "function") {
      onEditRow(data);
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
                onChange={onChange}
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
            render={({ field: { onChange, value } }) => (
              <ProjectSelect
                value={value}
                onChange={onChange}
                className={cn(hasError && "ring-2 ring-red-500")}
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
                onChange={(date) => onChange(date ? date.toISOString() : null)}
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
          rules={{ required: field.required }}
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
          <Button type="submit">Save Changes</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
