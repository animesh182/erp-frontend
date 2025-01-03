"use client";
import LeaveRequestDropDown from "@/components/LeaveRequestDropDown";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";




export const columns = [
  {
    accessorKey: "leaveReason",
    header: "Type of Leave",
    enableSorting: false,
    cell: ({ row }) => {
      const { leaveReason } = row.original;
      return leaveReason ? <span className="font-medium">{leaveReason}</span> : "No Data"; // Show "No Data" if the project is null or undefined
    },
  },
  {
    accessorKey: "startedLeaveDate",
    header: "From",
    cell: ({ row }) => {
      const { startedLeaveDate } = row.original;
      return (
        <span className="font-medium">
          {startedLeaveDate
            ? format(new Date(startedLeaveDate), "MMM dd yyyy")
            : "N/A"}
        </span>
      );
    },
    enableSorting: true,  
    hideOnMobile: true,
  },
  {
    accessorKey: "endedLeaveDate",
    header: "To",
    cell: ({ row }) => {
      const { endedLeaveDate } = row.original;
      return (
        <span className="font-medium">
          {endedLeaveDate
            ? format(new Date(endedLeaveDate), "MMM dd yyyy")
            : "N/A"}
        </span>
      );
    },
    enableSorting: true,
    hideOnMobile: true,  
  },
  {
    accessorKey: "numberOfLeaveDays",
    header: "Days",
    enableSorting: false,
    hideOnMobile: true,
    cell: ({ row }) => {
      const { numberOfLeaveDays } = row.original;
      return numberOfLeaveDays ? <span className="font-medium">{numberOfLeaveDays}</span> : "No Data"; // Show "No Data" if the project is null or undefined
    },
  },
  {
    accessorKey: "typeOfLeave",
    header: "Type",
    enableSorting: false,
    hideOnMobile: true,
    cell: ({ row }) => {
      const { typeOfLeave } = row.original;
      return typeOfLeave ? <span className="font-medium">{typeOfLeave}</span> : "No Data"; // Show "No Data" if the project is null or undefined
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <Badge
          className={`${
            status?.toLowerCase() === "approved"
            ? "bg-green-100 text-green-800"
            : status?.toLowerCase() === "pending"
            ? "bg-orange-300 text-orange-600"
            : "bg-red-100 text-red-800"
          }`}
        >
          {status ? status : "No Data"} {/* Show "No Data" */}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "detailedExplanation",
    header: "Detailed Explanation",
    enableSorting: false,
    hideOnMobile: true,
    cell: ({ row }) => {
      const { detailedExplanation } = row.original;
      return detailedExplanation ? (
        <span className="font-medium truncate max-w-xs block" title={detailedExplanation}>
          {detailedExplanation}
        </span>
      ) : (
        "No Data"
      );
    },
  },


  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <div className="flex items-center">
          <LeaveRequestDropDown rowData={rowData} />
        </div>
      );
    },
    enableSorting: false,
  },
];
