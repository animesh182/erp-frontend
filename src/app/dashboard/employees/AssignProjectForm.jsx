"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { ProjectSelect } from "@/components/ProjectSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/DatePicker";
import { cn, prettifyText } from "@/lib/utils";
import { toast } from "sonner";

const formSchema = z.object({
  projectName: z.string().min(1, "Project is required"),
  role: z.string().min(1, "Role is required"),
  timeAllocatedPerDay: z.number().int().min(1).max(12).positive(),
  startDate: z.string(),
  endDate: z.string().optional(),
});

const AssignProjectForm = ({
  projectOptions,
  roleOptions,
  onAssignProject,
  onEditProject,
  defaultValues,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {},
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        projectName: defaultValues.projectName,
        role: defaultValues.role,
        timeAllocatedPerDay: defaultValues.timeAllocatedPerDay,
        startDate: defaultValues.startDate,
        endDate: defaultValues.endDate,
      });
    } else {
      reset({
        projectName: "",
        role: "",
        timeAllocatedPerDay: 0,
        startDate: undefined,
        endDate: undefined,
      });
    }
  }, [defaultValues, reset]);

  const onSubmit = (data) => {
    if (defaultValues) {
      onEditProject(data);
    } else {
      onAssignProject(data);
    }
    reset();
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
            if (Component === ProjectSelect) {
              return (
                <ProjectSelect
                  projectOptions={projectOptions}
                  value={field.value}
                  onChange={field.onChange}
                  className={cn(hasError && "ring-2 ring-red-500")}
                />
              );
            }
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
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.id} value={role.title}>
                        {role.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
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
    <div className="mt-4">
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {renderField("projectName", ProjectSelect, { required: true })}
        {renderField("role", Select, { required: true })}
        {renderField("timeAllocatedPerDay", Input, {
          type: "number",
          min: "1",
          max: "12",
          required: true,
        })}
        {renderField("startDate", DatePicker, { required: true })}
        {renderField("endDate", DatePicker)}

        <Button type="submit">
          {defaultValues ? "Update Project" : "Assign Project"}
        </Button>
      </form>
    </div>
  );
};

export default AssignProjectForm;
