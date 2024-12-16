"use client";
import { FormRow } from "@/components/FormRow";
import TabFilters from "@/components/TabFilters";
import TableTitle from "@/components/TableTitle";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { createContext, useMemo, useState } from "react";

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
  const filteredData = useMemo(() => {    //memo used here as not using memo causes the component to render infinitely causing page to die
    let filtered = data;
  
    if (selectedTab !== "All") {
      filtered = filtered.filter((row) => {
        const status = row[filterColumn]?.toLowerCase(); // Ensure case insensitivity
  
        // If status is 'Ongoing' or has a dynamic value like 'x days ago', 'x hours ago'
        if (selectedTab === "Ongoing" && status === "ongoing") {
          return true;
        }
  
        // Use regex to check if status is a dynamic time (e.g., "2 days ago", "1 hour ago")
        if (selectedTab === "Completed" && /(\d+\s?(hour|day|minute)s? ago)/.test(status)) {
          return true;
        }
  
        return false;
      });
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
                totalItemCount={ table.getRowCount()}
                
              />
              <div className="lg:flex md:flex" >
              {tabs.map((tab) => (
              <Button
                key={tab}
                variant="employeePageBtn"
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  selectedTab === tab
                    ? "bg-secondary text-ring border border-ring"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </Button>
            ))}
            </div>
            </div>

            <div className="w-full">
              <div className="rounded-md">
                

<Table className="overflow-hidden ">
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
          >
            {row.getVisibleCells().map((cell, index) => (
              <TableCell
                key={cell.id}
                className={`${
                  cell.column.columnDef.hideOnMobile ? "hidden md:table-cell" : ""
                }`} 
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
