
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
import { toast } from "sonner";
import { updateLeaveRequestStatus } from "@/app/api/employees/approveLeaveRequest";
import { usePathname } from "next/navigation";

const LeaveRequestDropDown = ({ 
  rowData, 
  onStatusUpdate,  // Make this optional with a default no-op function
  onDeleteRow 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fallback to context if onDeleteRow not provided
  const { onDeleteRow: contextDeleteRow } = useContext(EditRowContext);
  const deleteHandler = onDeleteRow || contextDeleteRow;

  const pathname = usePathname();
  const isAdmin = "/dashboard/employees/leave-request";

  const handleDelete = useCallback(() => {
    deleteHandler(rowData.id);
    setIsDeleteDialogOpen(false);
  }, [deleteHandler, rowData.id]);  

  const handleApprove = useCallback(async () => {
    try {
      const response = await updateLeaveRequestStatus("Approved", rowData.id);
      if (response && response.message) {
        toast.success(response.message);
        // Call status update if provided
        onStatusUpdate?.(rowData.id, "Approved");
      }
    } catch (error) {
      toast.error("Failed to approve leave request.");
      console.error("Error approving leave request:", error);
    }
  }, [rowData.id, onStatusUpdate]);

  const handleDecline = useCallback(async () => {
    try {
      const response = await updateLeaveRequestStatus("Declined", rowData.id);
      if (response && response.message) {
        toast.success(response.message);
        // Call status update if provided
        onStatusUpdate?.(rowData.id, "Declined");
      }
    } catch (error) {
      toast.error("Failed to decline leave request.");
      console.error("Error declining leave request:", error);
    }
  }, [rowData.id, onStatusUpdate]);

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
        
        {pathname === isAdmin && 
        <>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleApprove();
              setIsDropdownOpen(false);
            }}
            className="hover:cursor-pointer text-pretty"
          >
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleDecline();
              setIsDropdownOpen(false);
            }}
            className="hover:cursor-pointer text-pretty"
          >
            Decline
          </DropdownMenuItem>
        </>
        }
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