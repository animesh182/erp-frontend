
  "use client";
  import React, { useContext, useState, useCallback } from "react";
  import { MoreHorizontal } from "lucide-react";
  import { EditRowContext } from "./ui/data-table";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import DeleteDialog from "./DeleteDialog";

  const LeaveRequestDropDown = ({ 
    rowData, 
    onDeleteRow 
  }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    // Fallback to context if onDeleteRow not provided
    const { onDeleteRow: contextDeleteRow } = useContext(EditRowContext);
    const deleteHandler = onDeleteRow || contextDeleteRow;

    const handleDelete = useCallback(() => {
      deleteHandler(rowData.id);
      setIsDeleteDialogOpen(false);
    }, [deleteHandler, rowData.id]);  


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
        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          itemName={rowData.name}
          onDelete={handleDelete}
        />
      </DropdownMenu>
    );
  };

  export default LeaveRequestDropDown;
