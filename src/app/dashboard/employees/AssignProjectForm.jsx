"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
}) => {
  // console.log(projectOptions, "proj");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      role: "",
      timeAllocatedPerDay: 0,
      startDate: new Date(),
      endDate: undefined,
    },
  });

  function onSubmit(values) {
    onAssignProject(values);
  }

  return (
    <div className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <ProjectSelect
                    projectOptions={projectOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.id} value={role.title}>
                        {role.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeAllocatedPerDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Allocated Per Day (hours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <DatePicker
                  selected={field.value}
                  onSelect={field.onChange}
                  onChange={(date) => field.onChange(date)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
                <DatePicker
                  selected={field.value}
                  onSelect={field.onChange}
                  onChange={(date) => field.onChange(date)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Assign Project</Button>
        </form>
      </Form>
    </div>
  );
};

export default AssignProjectForm;
