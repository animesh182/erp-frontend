"use client";
import React, { useState, useEffect, createContext } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const SimpleDataTableContext = createContext(null);

function SimpleDataTable({ columns, data, onRowSelect, onDeleteRow }) {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [userSelected, setUserSelected] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    if (onRowSelect && data.length > 0 && !userSelected) {
      onRowSelect(data[0]);
      setSelectedRowIndex(0);
    }
  }, [data, onRowSelect, userSelected]);

  const handleRowClick = (row, index) => {
    
    if (onRowSelect) {
      onRowSelect(row.original);
      setSelectedRowIndex(index);
      setUserSelected(true);
    }
  };


  return (
    <SimpleDataTableContext.Provider value={{ onDeleteRow }}>
      <div className="w-full">
        <div className="rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleRowClick(row, index)}
                    className={`${onRowSelect ? "cursor-pointer" : ""} ${
                      index === selectedRowIndex && onRowSelect
                        ? "bg-muted"
                        : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
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
        {/* <Pagination className="justify-end mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>
            {table.getPageOptions().map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => table.setPageIndex(page)}
                  isActive={table.getState().pagination.pageIndex === page}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
      
              <PaginationNext
              onClick={() => {
                if (table.getCanNextPage()) {
                  table.nextPage();
                }
              }}
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
    </SimpleDataTableContext.Provider>
  );
}

export default SimpleDataTable;
