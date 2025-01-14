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
import { Ellipsis } from "lucide-react";

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
        <Pagination className="justify-end mt-4">
  <PaginationContent>
    {/* Previous Button */}
    <PaginationItem>
      {table.getCanPreviousPage() && (
        <PaginationPrevious
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        />
      )}
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
      // const showEllipsisLeft = currentPage > 1; // Show ellipsis on the left
      const showEllipsisRight = currentPage < lastPage - 2; // Show ellipsis on the right

      // Add pages dynamically
      for (let page = Math.max(1, currentPage - 1); page <= Math.min(lastPage - 1, currentPage + 1); page++) {
        pages.push(page);
      }

      return (
        <>
          {/* {showEllipsisLeft && (
            <PaginationItem disabled>
              <PaginationLink>...</PaginationLink>
            </PaginationItem>
          )} */}
          
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => table.setPageIndex(page)}
                isActive={currentPage === page}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {showEllipsisRight && (
            <PaginationItem disabled>
             <Ellipsis className="h-4 w-4"/>
            </PaginationItem>
          )}

          {/* Last Page Button */}
          {totalPages > 1 && (
            <PaginationItem>
              <PaginationLink
                onClick={() => table.setPageIndex(lastPage)}
                isActive={currentPage === lastPage}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
        </>
      );
    })()}

    {/* Next Button */}
    <PaginationItem>
      {table.getCanNextPage() && (
        <PaginationNext
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        />
      )}
    </PaginationItem>
  </PaginationContent>
</Pagination>
      </div>
    </SimpleDataTableContext.Provider>
  );
}

export default SimpleDataTable;
