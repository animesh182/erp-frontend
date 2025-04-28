"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "./ui/switch";
import { PlusCircleIcon, User } from "lucide-react";
import { InviteMember } from "@/app/dashboard/taskboard/[id]/_components/InviteMember";

function ProjectSelector({
  title,
  options,
  defaultValue,
  onValueChange,
  placeholder = "Select",
}) {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");
  const [addProjectDialogOpen, setAddProjectDialogOpen] = useState(false);

  const handleSelectChange = (value) => {
    if (value === "__add_project__") {
      openAddProjectDialog();
      setSelectedValue(defaultValue || "");
    } else {
      setSelectedValue(value);
      if (onValueChange) {
        onValueChange(value);
      }
    }
  };

  const openAddProjectDialog = () => {
    setAddProjectDialogOpen(true);
  };

  return (
    <div className="flex flex-row gap-2 align-center justify-between p-4">
      <div className="flex flex-row gap-4 items-center">
        <h2 className="text-xl font-semibold text-center">{title}</h2>
        <Select onValueChange={handleSelectChange} value={selectedValue}>
          <SelectTrigger className="h-8 px-2 text-xs rounded-sm border border-gray-300 w-fit">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="text-xs">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="py-1 px-2 text-xs"
              >
                {option.label}
              </SelectItem>
            ))}
            <SelectItem
              value="__add_project__"
              className=" px-3 border-muted border-2 w-full cursor-pointer rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all flex justify-center items-center text-center"
            >
              <span className="flex flex-row justify-center items-end gap-1">
                <PlusCircleIcon className="w-4 h-4" />
                <span className="leading-none text-sm">Add New Project</span>
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        <AddProjectDialog
          open={addProjectDialogOpen}
          onOpenChange={setAddProjectDialogOpen}
        />
      </div>
      <div className="flex flex-row gap-4 items-center">
        <Switch />
        <h2>View assigned only</h2>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User size={14} className="text-primary" />
          </div>
        </div>
        <InviteMember />
      </div>
    </div>
  );
}

function AddProjectDialog({ open, onOpenChange }) {
  const [newProjectId, setNewProjectId] = useState("");
  const [newTaskboardName, setNewTaskboardName] = useState("");

  const handleAddProject = (projectId, taskboardName) => {
    console.log(
      `Adding project: ${projectId} with taskboard: ${taskboardName}`
    );
    onOpenChange(false);
    setNewProjectId("");
    setNewTaskboardName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Specify the project ID and a name for the new taskboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="newProjectId"
              className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Project ID
            </label>
            <Input
              id="newProjectId"
              className="col-span-3"
              value={newProjectId}
              onChange={(e) => setNewProjectId(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="newTaskboardName"
              className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Taskboard Name
            </label>
            <Input
              id="newTaskboardName"
              className="col-span-3"
              value={newTaskboardName}
              onChange={(e) => setNewTaskboardName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => handleAddProject(newProjectId, newTaskboardName)}
            disabled={!newProjectId || !newTaskboardName}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectSelector;
