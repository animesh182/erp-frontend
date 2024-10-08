"use client"; // Ensure this is at the top of the file

import React, { useState, useEffect } from "react";
import { columns } from "./Columns";

import TableTitle from "@/components/TableTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTab from "./ProjectsTab";
import PayrollTab from "./PayrollTab";
import EmployeeDetailsTab from "./EmployeeDetailsTab";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SimpleDataTable from "@/components/ui/simple-data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { EditEmployeeSheet } from "@/components/EditEmployeeSheet";
import { useEmployees } from "@/hooks/useEmployees";
import { useDeleteEmployee } from "@/sevices/useEmployeeServices";



export default function Employees() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("employeeDetails");
  const [employeeDetails, setEmployeeDetails] = useState(null);

  const { data: payments, isLoading, isError, error } = useEmployees();

  useEffect(() => {
    if (selectedEmployee && payments) {

      const employee = payments.find(emp => emp.id === selectedEmployee.id);

      if (employee) {
        setEmployeeDetails(employee);
      }
    }
  }, [selectedEmployee, payments]);

  // useEffect(() => {
  //   // Simulating a fetch request for employee details
  //   const fetchEmployeeDetails = async () => {
  //     // Replace this with actual API call later
  //     const mockResponse = {
  //       employeeId: "EMP002",
  //       dateOfBirth: "2002-12-03",
  //       gender: "Female",
  //       maritalStatus: "Married",
  //       country: "United States",
  //       phone: "+1 (555) 123-8567",
  //       email: "janedoe@example.com",
  //       linkedInName: "Jane Doe",
  //       linkedInUrl: "https://www.linkedin.com/in/janedoe",
  //       jobTitle: "Software Engineer",
  //       level: "L3",
  //       department: "Engineering",
  //       employeeType: "Full-time",
  //       supervisor: "John Doe",
  //       salary: 90000,
  //       panNumber: "ABCDE1224F",
  //     };

  //     // Simulate API delay
  //     // await new Promise((resolve) => setTimeout(resolve, 500));

  //     setEmployeeDetails(mockResponse);
  //   };
  //   if (selectedEmployee) {
  //     fetchEmployeeDetails();
  //   }
  // }, [selectedEmployee]);



  

  useEffect(() => {
    setActiveTab("employeeDetails");
  }, [selectedEmployee]);

  const handleEmployeeAdd = () => {
    setIsSheetOpen(true);
  };

 
 
  const{mutate:deleteEmployee}=useDeleteEmployee()




  const onAddEmployee = (formData) => {
    // Generate a new ID (you might want to use a more robust method in production)
    toast.success("Employee added successfully");
    console.log(formData);

    const newId = `employee_${Date.now()}`;
    const newEmployee = {
      id: newId,
      ...formData,
    };
    setPayments([...payments, newEmployee]);
    setIsSheetOpen(false);
  };

  const handleRowSelect = (row) => {
    setSelectedEmployee(row);
  };

  
  if(isLoading) return <p>loading.....</p>
  if(isError) return <p>{error.message}</p>

  return (
    <>
    {payments && (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="items-center">
        <div className="flex flex-row justify-end">
          <Button size="sm" className="gap-2" onClick={handleEmployeeAdd}>
            <PlusCircle className="h-4 w-4" /> Add Employee
          </Button>
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 py-4 px-0">
          <div className="flex flex-col px-5 py-5 items-center gap-1 text-left border rounded-md">
            <TableTitle
              title="List of Employees"
              subtitle="List of all employees in the company"
              totalItemCount={payments.length}
            />
            <SimpleDataTable
              // columns={columns}
              columns={columns(deleteEmployee)}
              data={payments}
              onRowSelect={handleRowSelect}
            />
          </div>
          <div className="flex flex-col items-center gap-1 text-center border rounded-md">
            <div className="h-24 w-full flex items-center bg-muted px-5 min-h-24">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={selectedEmployee?.imageUrl}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg font-semibold">
                    <span>
                      {selectedEmployee?.employeeName?.charAt(0)}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <div className="text-lg font-medium">
                    {selectedEmployee?.employeeName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedEmployee?.role}
                  </div>
                </div>
              </div>
            </div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full mt-4 justify-start text-left h-[calc(100%-7.2rem)] flex flex-col"
            >
              <TabsList className="mx-6 w-max">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
                <TabsTrigger value="employeeDetails">
                  Employee Details
                </TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-y-auto">
                <TabsContent value="employeeDetails">
                  <EmployeeDetailsTab employeeDetails={employeeDetails} />
                </TabsContent>
                <TabsContent value="projects">
                  <ProjectsTab employeeId={selectedEmployee?.userId} />
                </TabsContent>
                <TabsContent value="payroll">
                  <PayrollTab employeeId={selectedEmployee?.id} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
      <EditEmployeeSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onAddEmployee={onAddEmployee}
        //the edit employee is on the employee details tab
      />
    </main>)}
    </>
  );
}
