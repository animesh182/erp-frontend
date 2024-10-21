"use client";
import React, { useContext, useState, useCallback, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { EditRowContext } from "./ui/data-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProjectSheet } from "./EditProjectSheet";

const ProjectTableActionsDropdown = ({
  formInputs,
  onDelete,
  rowData,
  clients,
}) => {
  // console.log(rowData, "data");
  const [isOpen, setIsOpen] = useState(false);
  const { onEditRow } = useContext(EditRowContext);
  // console.log(onEditRow, "asdfasdfas");

  useEffect(() => {
    console.log("start-stop", isOpen);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleEditProject = useCallback(
    (projectId, data) => {
      onEditRow(projectId, data);
      handleClose();
    },
    [onEditRow]
  );

  const methods = useForm();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleOpen}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="hover:cursor-pointer">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <FormProvider {...methods}>
        <EditProjectSheet
          isOpen={isOpen}
          onClose={handleClose}
          projectData={rowData}
          onEditProject={handleEditProject}
          clients={clients}
        />
      </FormProvider>
    </DropdownMenu>
  );
};

export default ProjectTableActionsDropdown;
