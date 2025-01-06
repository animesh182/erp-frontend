"use client";
import { DatePicker } from "@/components/DatePicker";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { cloneElement, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ProjectSelect } from "./ProjectSelect";
import { cn } from "@/lib/utils";

export function FormRow({ formInputs, onAddRow, projectOptions }) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitSuccessful,isValid },
  } = useFormContext();

  const [isInitialized, setIsInitialized] = useState(false);
  const status = watch("status"); // Watch the value of the status field
  const invoiceIssuedDate = watch("invoiceIssuedDate");

  // console.log(invoiceIssuedDate, "date");

  useEffect(() => {
    const defaultValues = formInputs.reduce((acc, input) => {
      if (input.name && input.name !== "actions") {
        acc[input.name] = "";
      }
      return acc;
    }, {});
    reset(defaultValues);
    setIsInitialized(true);
  }, [formInputs, reset]);

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    onAddRow(data);
    reset();
  };

  const renderField = (field) => {
    if (!field.component) {
      console.error(`Component for field ${field.name} is undefined`);
      return null;
    }

    const Component = field.component.type;

    if (field.name !== "actions") {
      if (Component === Input) {
        return (
          <Input
            {...register(field.name, { required: field.required })}
            {...field.component.props}
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
                value={value || "None"}
                onChange={onChange}
                projectOptions={projectOptions}
              />
            )}
          />
        );
      }

      if (field.name === "paidDate") {
        // Disable the paidDate field if status is not "paid"
        return (
          <Controller
            control={control}
            name={field.name}
            rules={{ required: field.required && status === "Paid" }}
            render={({ field: { onChange, value } }) => (
              <Component
                {...field.component.props}
                value={value || ""}
                onChange={Component === DatePicker ? onChange : undefined}
                onValueChange={Component === Select ? onChange : undefined}
                disabled={status !== "Paid"}
                minDate={
                  Component === DatePicker ? invoiceIssuedDate : undefined
                }
              />
            )}
          />
        );
      }
      // if (Component === SimpleDatePicker) {
      //   return (
      //     <Controller
      //       control={control}
      //       name={field.name}
      //       rules={{ required: field.required }}
      //       render={({ field: { onChange, value } }) => (
      //         <SimpleDatePicker
      //           {...field.component.props}
      //           value={value || ""}
      //           onChange={onChange}
      //         />
      //       )}
      //     />
      //   );
      // }

      return (
        <Controller
          control={control}
          name={field.name}
          rules={{ required: field.required }}
          render={({ field: { onChange, value } }) => (
            <Component
              {...field.component.props}
              value={value || ""}
              onChange={Component === DatePicker ? onChange : undefined}
              onValueChange={Component === Select ? onChange : undefined}
            />
          )}
        />
      );
    } 
  //   else {
  //     return (
  //       <Component
  //         onClick={handleSubmit(onSubmit)}
  //         {...field.component.props}
  //       />
  //     );
  //   }
  // };
        else {
          // Modify the button component to include disabled state and styling
          return cloneElement(field.component, {
            onClick: handleSubmit(onSubmit),
            disabled: !isValid,
            // className: cn(
            //   field.component.props.className,
            //   "transition-colors",
            //   // !isValid && "bg-gray-300 hover:bg-gray-300 cursor-not-allowed opacity-50"
            //   !isValid && "bg-secondary text-accent-foreground cursor-not-allowed opacity-50"
            // )
          });
        }
      };
  if (!isInitialized) {
    return null; // or return a loading indicator
  }

  return (
    <TableRow>
      {formInputs.map((field, index) => (
        <TableCell key={index}>{renderField(field)}</TableCell>
      ))}
    </TableRow>
  );
}
