// "use client";
// import React, { useContext, useState, useCallback, useEffect } from "react";
// import { MoreHorizontal } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { EditRowContext } from "./ui/data-table";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import DeleteDialog from "./DeleteDialog";

// const LeaveRequestDropDown = ({ rowData }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const {onDeleteRow } = useContext(EditRowContext);
//   const {onEditRow } = useContext(EditRowContext);

//   const handleOpen = () => {
//     setIsOpen(true);
//   };


//   const handleDelete = useCallback(() => {
//     onDeleteRow(rowData.id);
//     setIsDeleteDialogOpen(false);
//   }, [onDeleteRow, rowData.id]);

//   const handleApprove = useCallback(() => {
//     onEditRow(rowData.id);
//   }, [onEditRow, rowData.id]);

//   const handleDecline = useCallback(() => {
//     onEditRow(rowData.id);
//   }, [onEditRow, rowData.id]);


//   const methods = useForm();

//   return (
//     <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
//       <DropdownMenuTrigger asChild>
//         <button className="p-2 hover:cursor-pointer">
//           <MoreHorizontal className="h-4 w-4" />
//           <span className="sr-only">Actions</span>
//         </button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem
//           onSelect={(e) => {
//             e.preventDefault();
//             setIsDeleteDialogOpen(true);
//             setIsDropdownOpen(false);
//           }}
//           className="hover:cursor-pointer text-pretty"
//         >
//           Approve
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onSelect={(e) => {
//             e.preventDefault();
//             setIsDeleteDialogOpen(true);
//             setIsDropdownOpen(false);
//           }}
//           className="hover:cursor-pointer text-pretty"
//         >
//           Decline
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onSelect={(e) => {
//             e.preventDefault();
//             setIsDeleteDialogOpen(true);
//             setIsDropdownOpen(false);
//           }}
//           className="hover:cursor-pointer text-destructive"
//         >
//           Delete
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//       <DeleteDialog
//         isOpen={isDeleteDialogOpen}
//         onClose={() => setIsDeleteDialogOpen(false)}
//         itemName={rowData.name}
//         onDelete={handleDelete}
//       />
//     </DropdownMenu>
//   );
// };

// export default LeaveRequestDropDown;

"use client";
import React, { useContext, useState, useCallback, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
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
import DeleteDialog from "./DeleteDialog";
// import { updateLeaveRequestStatus } from "@/lib/utils";
import { toast } from "sonner";
import { updateLeaveRequestStatus } from "@/app/api/employees/approveLeaveRequest";
import { usePathname } from "next/navigation";

const LeaveRequestDropDown = ({ rowData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { onDeleteRow } = useContext(EditRowContext);


  const pathname=usePathname()
  const handleDelete = useCallback(() => {
    onDeleteRow(rowData.id);
    setIsDeleteDialogOpen(false);
  }, [onDeleteRow, rowData.id]);  

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshComponent = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

const isAdmin="/dashboard/employees/leave-request"

  const handleApprove = useCallback(async () => {
    try {
      const response = await updateLeaveRequestStatus("Approved", rowData.id);
      if (response && response.message) {
        toast.success(response.message);
        refreshComponent();
      }
    } catch (error) {
      toast.error("Failed to approve leave request.");
      console.error("Error approving leave request:", error);
    }
  }, [rowData.id, refreshComponent]);

  const handleDecline = useCallback(async () => {
    try {
      const response = await updateLeaveRequestStatus("Declined", rowData.id);
      if (response && response.message) {
        toast.success(response.message);
        refreshComponent();
      }
    } catch (error) {
      toast.error("Failed to decline leave request.");
      console.error("Error declining leave request:", error);
    }
  }, [rowData.id, refreshComponent]);



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
        
        {pathname===isAdmin && 
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
