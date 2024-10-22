"use client";
import React, { useContext, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { SimpleDataTableContext } from "./ui/simple-data-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDialog from "./DeleteDialog";

const EmployeeTableActionsDropdown = ({ rowData }) => {
  console.log(rowData, "rowData");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { onDeleteRow } = useContext(SimpleDataTableContext);

  const handleDelete = () => {
    onDeleteRow(rowData.id);
    setIsDeleteDialogOpen(false);
  };

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
        <DropdownMenuItem
          onClick={() => setIsDeleteDialogOpen(true)}
          className="hover:cursor-pointer text-destructive"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        itemName={rowData?.full_name}
        onDelete={handleDelete}
      />
    </DropdownMenu>
  );
};

export default EmployeeTableActionsDropdown;
