"use client";
import React, { useContext, useState } from "react";
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
import { EditRowSheet } from "./EditRowSheet";
import DeleteDialog from "./DeleteDialog";

const TableActionsDropdown = ({ formInputs, rowData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { onEditRow, onDeleteRow } = useContext(EditRowContext);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleDelete = () => {
    onDeleteRow(rowData.id);
    setIsDeleteDialogOpen(false);
  };

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
        <DropdownMenuItem
          onClick={() => setIsDeleteDialogOpen(true)}
          className="hover:cursor-pointer text-destructive"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <FormProvider {...methods}>
        <EditRowSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          rowData={rowData}
          formInputs={formInputs}
          onEditRow={onEditRow}
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

export default TableActionsDropdown;
