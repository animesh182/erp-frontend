"use client";
import React, { useState, useMemo, createContext, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowUpDown, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormRow } from "../FormRow";
import TableTitle from "../TableTitle";
import { Input } from "./input";
import DateRangePicker from "../DateRangePicker";
import TabFilters from "../TabFilters";
import { usePathname, useRouter } from "next/navigation";

export const EditRowContext = createContext(null); //creating context for the edit row function

function DataTable({
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
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const isProjectPage = pathname === "/dashboard/projects";
  const isUsersPage = pathname === "/users/dashboard";
  const isLeavePage = pathname === "/users/leave-request";
  const isTransactionPage = pathname === "/dashboard/finances/transactions";



 

  // Memoize filtered data
  const filteredData = useMemo(() => {
    let filtered = data;

    if (selectedTab !== "All") {
      // console.log(data, "data");
      // console.log(`Filtering by ${filterColumn}: ${selectedTab}`);
      filtered = filtered.filter((row) => row[filterColumn] === selectedTab);
    }

    if (searchValue) {
      filtered = filtered.filter(
        (row) =>
          row.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          (row.projectName &&
            row.projectName.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }

    return filtered;
  }, [data, selectedTab, filterColumn, searchValue]);

  // Initialize table instance with pagination
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    pageCount: Math.ceil(filteredData.length / 10), // Adjust page size as needed
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false, // You are not fetching data for each page separately
    initialState: {
      pagination: {
        pageSize: 10, // Number of rows per page
        pageIndex: 0, // Starting from the first page
      },
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
            <div className="w-full lg:flex md:flex   items-start justify-between">
              <TableTitle
                title={title}
                subtitle={subtitle}
                totalItemCount={(isUsersPage | isProjectPage | isLeavePage) && table.getRowCount()}
              />
              {!pathname.includes("/leave-request") &&
              <div className="relative w-full mr-4">
                <Search className="absolute top-1/2 left-3 transform -translate-y-1/2" />
                <Input
                  type="search"
                  placeholder="Search.."
                  className="pl-12"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>}
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

              {/* Pagination Controls */}
              <Pagination className="justify-end mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    />
                  </PaginationItem>
                  {Array.from({ length: table.getPageCount() }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => table.setPageIndex(index)}
                        isActive={
                          table.getState().pagination.pageIndex === index
                        }
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </EditRowContext.Provider>
  );
}

export default DataTable;
