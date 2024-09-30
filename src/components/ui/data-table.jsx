"use client";
import React, { useState, useMemo, createContext } from "react";
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
}) {
  const [sorting, setSorting] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const isProjectPage = pathname === "/dashboard/projects";
  const isTransactionPage = pathname === "/dashboard/finances/transactions";

  const filteredData = useMemo(() => {
    let filtered = data;

    if (selectedTab !== "All") {
      filtered = filtered.filter((row) => row[filterColumn] === selectedTab);
    }

    if (searchValue) {
      filtered = filtered.filter((row) =>
        row.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return filtered;
  }, [data, selectedTab, filterColumn, searchValue]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const filterValues =
    formInputs?.find((input) => input.name === filterColumn)?.filterValues ||
    [];

  const handleRowClick = (id, event) => {
    // event.stopPropagation();
    // event.preventDefault();
    if (isProjectPage) {
      router.push(`/dashboard/projects/${id}`);
    }
  };
  return (
    <EditRowContext.Provider value={{ onEditRow }}>
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
            <div className="w-full flex items-start justify-between">
              <TableTitle
                title={title}
                subtitle={subtitle}
                totalItemCount={isProjectPage && table.getRowCount()}
              />
              <div className="relative w-full mr-4">
                <Search className="absolute top-1/2 left-3 transform -translate-y-1/2" />
                <Input
                  type="search"
                  placeholder="Search.."
                  className="pl-12"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
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
                            className={
                              header.column.getCanSort() ? "cursor-pointer" : ""
                            }
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
                              isProjectPage
                                ? "cursor-pointer hover:bg-muted"
                                : isTransactionPage
                                ? row.original.costType === "expense"
                                  ? "bg-[#FEF2F2]"
                                  : row.original.costType === "revenue"
                                  ? "bg-[#f0fdf4]"
                                  : ""
                                : ""
                            }
                          >
                            {row.getVisibleCells().map((cell, index) => (
                              <TableCell
                                key={cell.id}
                                onClick={
                                  index !== row.getVisibleCells().length - 1 &&
                                  !(
                                    isProjectPage &&
                                    cell.column.id === "progressTracking"
                                  )
                                    ? (event) =>
                                        handleRowClick(row.original.id, event)
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
                        {isTableAddFormEnabled && (
                          <FormRow
                            onAddRow={onAddRow}
                            formInputs={formInputs}
                            projectOptions={projectOptions}
                          />
                        )}
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
                  </TableBody>
                </Table>
              </div>
              <Pagination className="justify-end mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
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
