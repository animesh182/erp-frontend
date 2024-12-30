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
  isMonthPicker = false,
}) {
  const [sorting, setSorting] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const isProjectPage = pathname === "/dashboard/projects";
  const isUsersPage = pathname === "/users/dashboard";
  const isTransactionPage = pathname === "/dashboard/finances/transactions";
  // const [selectedTab, setSelectedTab] = useState("All");
  const [selectedTab, setSelectedTab] = useState(isProjectPage ? "Ongoing" : "All");

  // Memoize filtered data
  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedTab !== "All") {
      console.log(`Filtering by ${filterColumn} === ${selectedTab}`);
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
    pageCount: Math.ceil(filteredData.length / 30), // Adjust page size as needed
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false, // You are not fetching data for each page separately
    initialState: {
      pagination: {
        pageSize: 30, // Number of rows per page
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
                totalItemCount={table.getRowCount()}
                // totalItemCount={(isUsersPage | isProjectPage | isLeavePage | isAdminLeavePage) && table.getRowCount()}
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
                    isMonthPicker={isMonthPicker}
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
                  ? "bg-[#dc9d9c]/35" // Light red for expense
                  : row.original.transactionType === "Revenue"
                  ? "bg-[#e0f2f1]" // Light green for revenue
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
              {/* <Pagination className="justify-end mt-4">
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
              </Pagination> */}

<Pagination className="justify-end mt-4">
  <PaginationContent>
    {/* Previous Button */}
    <PaginationItem>
   {table.getCanPreviousPage() &&  <PaginationPrevious
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      />}
    </PaginationItem>

    {/* First Page Button */}
    <PaginationItem>
      <PaginationLink
        onClick={() => table.setPageIndex(0)}
        isActive={table.getState().pagination.pageIndex === 0}
      >
        1
      </PaginationLink>
    </PaginationItem>

    {/* Dynamic Page Numbers */}
    {(() => {
      const currentPage = table.getState().pagination.pageIndex;
      const totalPages = table.getPageCount();
      const lastPage = totalPages - 1;

      const pages = [];

      // Add pages dynamically
      for (let page = Math.max(1, currentPage - 1); page <= Math.min(lastPage - 1, currentPage + 1); page++) {
        pages.push(page);
      }

      return pages.map((page) => (
        <PaginationItem key={page}>
          <PaginationLink
            onClick={() => table.setPageIndex(page)}
            isActive={currentPage === page}
          >
            {page + 1}
          </PaginationLink>
        </PaginationItem>
      ));
    })()}

    {/* Last Page Button */}
    {table.getPageCount() > 1 && (
      <PaginationItem>
        <PaginationLink
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          isActive={
            table.getState().pagination.pageIndex ===
            table.getPageCount() - 1
          }
        >
          {table.getPageCount()}
        </PaginationLink>
      </PaginationItem>
    )}

    {/* Next Button */}
    <PaginationItem>
   {table.getCanNextPage() &&   <PaginationNext
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      />}
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

