"use client";
import React, { useEffect } from "react";
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
  clients,
}) {
  // console.log("in edit project sheet");
  // console.log(projectData);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors,isValid },
  } = useForm({
    defaultValues: projectData || {}, // If editing, set default values
  });

  const projectType = watch("type");

  useEffect(() => {
    if (isOpen) {
      // console.log("khule ma");
      if (projectData) {
        reset({
          name: projectData.name,
          health: projectData.project_health,
          projectCategory: projectData.project_category,
          platform: projectData.platform,
          client: projectData.client,
          status: projectData.project_status,
          // teamMembersCount: projectData?.all_user_projects?.length || 0, //because no attribute from the backend of number
          type: projectData.type,
          progress: projectData.completion,
          startDate: projectData.start_date,
          endDate: projectData.completion_date,
          budget: projectData.budget,
          projectDescription: projectData.description,
        });
      } else {
        // Reset to empty fields for adding a new project
        reset({
          name: "",
          health: "",
          projectCategory: "",
          platform: "",
          client: "",
          status: "",
          // teamMembersCount: 0,
          type: "",
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
      // If editing, call onEditProject with the project ID
      onEditProject(projectData.id, data);
    } else {
      // If adding a new project, call onAddProject
      onAddProject(data);
    }
    reset(); // Reset the form after submission
    onClose(); // Close the sheet
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
                  <SelectItem value="on_track">On Track</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </>
              ),
            })}
            {renderField("projectCategory", Input, { required: false })}
            {renderField("platform", Input, { required: false })}
            {renderField("type", Select, {
              required: true,
              children: (
                <>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                </>
              ),
            })}
            {renderField("client", Select, {
              required: true,
              children: clients
                ? clients.map((client, index) => {
                    return (
                      <SelectItem
                        className="capitalize"
                        key={index}
                        value={client.name}
                      >
                        {client.name}
                      </SelectItem>
                    );
                  })
                : null,
            })}
            {renderField("status", Select, {
              required: true,
              children: (
                <>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </>
              ),
            })}
            {/* {renderField("teamMembersCount", Input, {
              type: "number",
              min: "0",
              required: true,
            })} */}
            {renderField("progress", Slider, {
              min: 0,
              max: 100,
              step: 10,
              required: true,
            })}
            {renderField("startDate", DatePicker, { required: true })}
            {renderField("endDate", DatePicker, {
              required: projectType === "fixed",
            })}
            {renderField("budget", Input, {
              type: "number",
              min: "0",
              required: true,
            })}
          </div>

          <Button type="submit" disabled={!isValid}>
            {projectData ? "Save Changes" : "Add Project"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
