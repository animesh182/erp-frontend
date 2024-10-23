"use client";
import React, { useContext, useState, useCallback, useEffect } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
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
import DeleteDialog from "./DeleteDialog";

const ProjectTableActionsDropdown = ({ rowData, clients }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { onEditRow, onDeleteRow } = useContext(EditRowContext);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleDelete = useCallback(() => {
    onDeleteRow(rowData.id);
    setIsDeleteDialogOpen(false);
  }, [onDeleteRow, rowData.id]);

  const handleEditProject = useCallback(
    (projectId, data) => {
      onEditRow(projectId, data);
      handleClose();
    },
    [onEditRow, handleClose]
  );

  const methods = useForm();

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
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
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setIsDeleteDialogOpen(true);
            setIsDropdownOpen(false);
          }}
          className="hover:cursor-pointer text-destructive"
        >
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
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        itemName={rowData.name}
        onDelete={handleDelete}
      />
    </DropdownMenu>
  );
};

export default ProjectTableActionsDropdown;
