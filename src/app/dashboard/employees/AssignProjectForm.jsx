"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { apiClient } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner";

// Zod schema with date preprocessing
const formSchema = z.object({
  projectId: z.string().min(1, "Project name is required"),
  role: z.string().min(1, "Role is required").max(50),
  timeAllocatedPerDay: z.string().min(1, "Time is required"),
  startDate: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date({ required_error: "Start date is required" })
  ),
  endDate: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date({ required_error: "End date is required" })
  ),
});

const AssignProjectForm = ({ projects, roles, userId }) => {
  console.log(userId, "uiii");
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: "",
      role: "",
      timeAllocatedPerDay: "",
      startDate: null,
      endDate: null,
    },
  });

  const watchData = watch();

  useEffect(() => {
    console.log(watchData); // Watch form data as it changes
  }, [watchData]);

  const formatDate = (date) => {
    return date ? date.toISOString().split("T")[0] : null; // Format as YYYY-MM-DD
  };

  // Form submit handler
  const onSubmit = async (formData) => {
    const payload = {
      project_id: formData.projectId,
      utilization: formData.timeAllocatedPerDay,
      project_role: formData.role,
      start_date: formatDate(formData.startDate), // Format start date
      end_date: formatDate(formData.endDate), // Format end date
    };
    try {
      const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}api/user_projects/${userId}/`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      console.log(response, "response");

      if (response.ok) {
        toast.success("Project assigned successfully");
      }
    } catch (error) {
      toast.error("There was an error assigning the project");
      console.error(error);
    }
  };

  const onError = (errors) => {
    console.error(errors); // Log errors if validation fails
    toast.error("Please fill in all required fields correctly.");
  };
  console.log(projects);
  return (
    <div className="mt-4 max-w-lg mx-auto">
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* Project Name Field */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Project Name</label>
          <Controller
            name="projectId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project, index) => (
                    <SelectItem key={index} value={String(project.id)}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.projectId && (
            <p className="text-sm text-red-500">{errors.projectId.message}</p>
          )}
        </div>

        {/* Role Field */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Role</label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role, index) => (
                    <SelectItem key={index} value={role.title}>
                      {role.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && (
            <p className="text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>

        {/* Time Allocated Field */}
        <div className="space-y-1">
          <label className="text-sm font-medium">
            Time Allocated (per day)
          </label>
          <Controller
            name="timeAllocatedPerDay"
            control={control}
            render={({ field }) => <Input {...field} placeholder="4 hours" />}
          />
          {errors.timeAllocatedPerDay && (
            <p className="text-sm text-red-500">
              {errors.timeAllocatedPerDay.message}
            </p>
          )}
        </div>

        {/* Start Date Field */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Start Date</label>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                placeholderText="Select start date"
              />
            )}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        {/* End Date Field */}
        <div className="space-y-1">
          <label className="text-sm font-medium">End Date</label>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                placeholderText="Select end date"
              />
            )}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default AssignProjectForm;
