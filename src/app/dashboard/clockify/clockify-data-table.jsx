"use client";
import React, { useState, useMemo, createContext, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormRow } from "@/components/FormRow";
import TableTitle from "@/components/TableTitle";
import { Input } from "@/components/ui/input";
import DateRangePicker from "@/components/DateRangePicker";
import TabFilters from "@/components/TabFilters";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const EditRowContext = createContext(null); 

function ClockifyDataTable({
  title,
  subtitle,
  columns,
  data,
  onEditRow,
  isTableAddFormEnabled,
  onAddRow,
  formInputs,
  filterColumn,
  onDateChange,
  initialStartDate,
  initialEndDate,
  projectOptions,
  onDeleteRow,
  userId,
}) {
  const [sorting, setSorting] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const pathname = usePathname();
  const router = useRouter();
  const isProjectPage = pathname === "/dashboard/projects";
  const isUsersPage = pathname === "/users/dashboard";
  const isLeavePage = pathname === "/users/leave-request";
  const isAdminLeavePage = pathname === "/dashboard/employees/leave-request"
  const isTransactionPage = pathname === "/dashboard/finances/transactions";



  // Memoize filtered data
  const filteredData = useMemo(() => {
    let filtered = data;

    if (selectedTab !== "All") {
      filtered = filtered.filter((row) => row[filterColumn] === selectedTab);
    }



    return filtered;
  }, [data, selectedTab, filterColumn]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    pageCount: Math.ceil(filteredData.length / 10), // Adjust page size as needed
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
   
      sorting: [
        {
          id: "invoicedIssuedDate",
          desc: false,
        },
      ],
    },
  });

  const filterValues =
    formInputs?.find((input) => input.name === filterColumn)?.filterValues ||
    [];

  const handleRowClick = (id,row, event) => {
    if (isProjectPage) {
      router.push(`/dashboard/projects/${id}`);
    }
    if(isUsersPage){
      router.push(`/users/dashboard/${id}/?userId=${userId}`);
     
  
    }
  };

  const tabs = ["All", "Ongoing", "Completed"];

  return (
    <EditRowContext.Provider value={{ onEditRow, onDeleteRow }}>
      <div className="w-full">
        <div className="space-y-5">
          {filterValues.length > 0 && (
            <TabFilters
              filterValues={filterValues}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}
            
          <div className="p-5 text-left border rounded-md">
            {/* <div className="w-full flex items-start justify-between"> */}
            <div className="w-full lg:flex md:flex items-start justify-between flex-col">
              <TableTitle
                title={title}
                subtitle={subtitle}
                totalItemCount={(isUsersPage | isProjectPage | isLeavePage | isAdminLeavePage) && table.getRowCount()}
                
              />
              <div className="lg:flex md:flex" >
              {tabs.map((tab) => (
              <Button
                key={tab}
                variant="employeePageBtn"
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  selectedTab === tab
                    ? "bg-blue-50 text-blue-600 border border-blue-500"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </Button>
            ))}
            </div>
              {initialStartDate && initialEndDate && onDateChange && (
                <div>
                  <DateRangePicker
                    onDateChange={onDateChange}
                    initialStartDate={initialStartDate}
                    initialEndDate={initialEndDate}
                  />
                </div>
              )}
            </div>

            <div className="w-full">
              <div className="rounded-md">
                

<Table>
  <TableHeader>
    {table.getHeaderGroups().map((headerGroup) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <TableHead
            key={header.id}
            onClick={
              header.column.getCanSort()
                ? header.column.getToggleSortingHandler()
                : undefined
            }
            className={`${
              header.column.getCanSort() ? "cursor-pointer" : ""
            } ${header.column.columnDef.hideOnMobile ? "hidden md:table-cell" : ""}`} // Conditionally hide on mobile
          >
            <div className="flex items-center gap-2">
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
              {header.column.getCanSort() && (
                <span>
                  <ArrowUpDown className="h-4 w-4" />
                </span>
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    ))}
  </TableHeader>
  <TableBody>
    {table.getRowModel().rows?.length ? (
      <>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className={
              isProjectPage || isUsersPage
                ? "cursor-pointer hover:bg-muted"
             
                : isTransactionPage
                ? row.original.transactionType === "Expense"
                  ? "bg-[#dc9d9c]" // Light red for expense
                  : row.original.transactionType === "Revenue"
                  ? "bg-[#78ae78]" // Light green for revenue
                  : ""
                : ""
            }
          >
            {row.getVisibleCells().map((cell, index) => (
              <TableCell
                key={cell.id}
                className={`${
                  cell.column.columnDef.hideOnMobile ? "hidden md:table-cell" : ""
                }`} // Conditionally hide on mobile
                onClick={
                  index !== row.getVisibleCells().length - 1 &&
                  !(
                    isProjectPage &&
                    cell.column.id === "progressTracking"
                  )
                    ? (event) => handleRowClick(row.original.id,row.original, event)
                    : undefined
                }
              >
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    ) : (
      <TableRow>
        <TableCell
          colSpan={columns.length}
          className="h-24 text-center"
        >
          No results.
        </TableCell>
      </TableRow>
    )}
    {isTableAddFormEnabled && (
      <FormRow
        onAddRow={onAddRow}
        formInputs={formInputs}
        projectOptions={projectOptions}
      />
    )}
  </TableBody>
</Table>

              </div>
            </div>
          </div>
        </div>
      </div>
    </EditRowContext.Provider>
  );
}

export default ClockifyDataTable;