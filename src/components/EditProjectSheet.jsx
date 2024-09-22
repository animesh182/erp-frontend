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
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

export function EditProjectSheet({
  isOpen,
  onClose,
  projectData,
  onEditProject,
  onAddProject,
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: projectData || {},
  });

  React.useEffect(() => {
    if (isOpen) {
      if (projectData) {
        reset(projectData);
      } else {
        reset({
          name: "",
          health: "",
          projectCategory: "",
          platform: "",
          clientName: "",
          clientEmail: "",
          status: "",
          teamMembersCount: "",
          progress: 0,
          startDate: null,
          endDate: null,
          budget: "",
          projectDescription: "",
        });
      }
    }
  }, [isOpen, projectData, reset]);

  const onSubmit = (data) => {
    if (projectData) {
      onEditProject(data);
    } else {
      onAddProject(data);
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
            if (Component === Slider) {
              return (
                <div className="flex items-center space-x-2">
                  <Component
                    {...field}
                    {...props}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className={cn(
                      props?.className,
                      hasError && "ring-2 ring-red-500"
                    )}
                  />
                  <span>{field.value}%</span>
                </div>
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
          title={projectData ? "Edit Project" : "Add Project"}
        />
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="space-y-6 mt-4"
        >
          <div className="space-y-4">
            {renderField("name", Input, { required: true })}
            {renderField("projectDescription", Textarea, { required: true })}

            {renderField("health", Select, {
              required: true,
              children: (
                <>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </>
              ),
            })}
            {renderField("projectCategory", Input, { required: true })}
            {renderField("platform", Input, { required: true })}
            {renderField("clientName", Input, { required: true })}
            {renderField("clientEmail", Input, {
              type: "email",
              required: true,
            })}
            {renderField("status", Select, {
              required: true,
              children: (
                <>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="ongoing">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </>
              ),
            })}
            {renderField("teamMembersCount", Input, {
              type: "number",
              min: "0",
              required: true,
            })}
            {renderField("progress", Slider, {
              min: 0,
              max: 100,
              step: 1,
              required: true,
            })}
            {renderField("startDate", DatePicker, { required: true })}
            {renderField("endDate", DatePicker, { required: true })}
            {renderField("budget", Input, {
              type: "number",
              min: "0",
              required: true,
            })}
          </div>

          <Button type="submit">
            {projectData ? "Save Changes" : "Add Project"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
