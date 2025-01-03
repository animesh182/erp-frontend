"use client";
import { MoreHorizontal } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { EditRowContext } from "./ui/data-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const LeaveTableActionsDropdown = ({
  
  onDelete,
  
}) => {
  // console.log(rowData, "data");
  const [isOpen, setIsOpen] = useState(false);
  const { onEditRow } = useContext(EditRowContext);
  // console.log(onEditRow, "asdfasdfas");

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
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
        <DropdownMenuItem onClick={onDelete} className="hover:cursor-pointer">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LeaveTableActionsDropdown;
