"use client"; // Ensure this is at the top of the file

import React, { useState, useEffect, useCallback } from "react";
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
import { createEmployee } from "@/app/api/employees/createEmployee";
import { getRoles } from "@/app/api/role/getRoles";
import { getLevels } from "@/app/api/level/getLevels";
import { getProjects } from "@/app/api/projects/getProjects";
import { getEmployees } from "@/app/api/employees/getEmployees";
import { deleteEmployeeById } from "@/app/api/employees/deleteEmployeeById";

export default function Employees() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("employeeDetails");
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshComponent = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  const [payments, setPayments] = useState([
    {
      id: "728ed52f",
      employeeName: "John Doe",
      imageUrl: "/default-avatar.jpg",
      email: "john.doe@example.com",
      role: "Software Engineer",
      type: "Executive",
      salary: 12000,
    },
    {
      id: "489e1d42",
      employeeName: "Jane Smith",
      imageUrl: "/default-avatar.jpg",
      email: "jane.smith@example.com",
      role: "Product Manager",
      type: "Full-time",
      salary: 11000,
    },
    {
      id: "153b3a2c",
      employeeName: "Bob Johnson",
      imageUrl: "/default-avatar.jpg",
      email: "bob.johnson@example.com",
      role: "UX Designer",
      type: "Part-time",
      salary: 8000,
    },
    {
      id: "621f4e3b",
      employeeName: "Alice Williams",
      imageUrl: "/default-avatar.jpg",
      email: "alice.williams@example.com",
      role: "Data Analyst",
      type: "Full-time",
      salary: 9500,
    },
    {
      id: "984c7d6a",
      employeeName: "Charlie Brown",
      imageUrl: "/default-avatar.jpg",
      email: "charlie.brown@example.com",
      role: "Marketing Specialist",
      type: "Contract",
      salary: 8500,
    },
  ]);

  const fetchRoles = async () => {
    try {
      const roles = await getRoles();
      setRoleOptions(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const projects = await getProjects(true);
      setProjectOptions(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchLevels = async () => {
    try {
      const levels = await getLevels();
      setLevelOptions(levels);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  useEffect(() => {
    const getEmployeeDetails = async () => {
      try {
        const { status, data } = await getEmployees();
        if (status === 200) {
          setEmployeeDetails(data);
        } else {
          console.error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    getEmployeeDetails();
    fetchRoles();
    fetchLevels();
    fetchProjects();
  }, [refreshKey]);

  const handleEmployeeAdd = () => {
    setIsSheetOpen(true);
  };

  const onAddEmployee = async (formData) => {
    try {
      const response = await createEmployee(formData);
      toast.success("Employee added successfully");
      console.log(response);

      const newEmployee = {
        id: response.id,
        ...formData,
      };
      setPayments([...payments, newEmployee]);
      setIsSheetOpen(false);
      refreshComponent();
    } catch (error) {
      toast.error(error.message || "Failed to add employee");
      console.error("Error adding employee:", error);
    }
  };

  const onDeleteEmployee = async (id) => {
    try {
      const response = await deleteEmployeeById(id);
      toast.success("Employee deleted successfully");
      refreshComponent();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee");
    }
  };

  const handleRowSelect = (row) => {
    setSelectedEmployee(row);
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") {
      return "";
    }
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="items-center">
        <div className="flex flex-row justify-end">
          <Button size="sm" className="gap-2" onClick={handleEmployeeAdd}>
            <PlusCircle className="h-4 w-4" /> Add Employee
          </Button>
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 py-4 px-0">
          <div className="h-screen flex flex-col px-5 py-5 items-center gap-1 text-left border rounded-md">
            {employeeDetails && employeeDetails.length > 0 && (
              <>
                <TableTitle
                  title="List of Employees"
                  subtitle="List of all employees in the company"
                  totalItemCount={employeeDetails.length}
                />
                <SimpleDataTable
                  columns={columns}
                  data={employeeDetails}
                  onRowSelect={handleRowSelect}
                  onDeleteRow={onDeleteEmployee}
                />
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-1 text-center border rounded-md">
            <div className="h-24 w-full flex items-center bg-muted px-5 min-h-24">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={selectedEmployee?.imageUrl}
                    className="object-cover"
                  />

                  <AvatarFallback>
                    {selectedEmployee?.imageUrl ? (
                      <span>{selectedEmployee?.full_name}</span>
                    ) : (
                      getInitials(selectedEmployee?.full_name)
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <div className="text-lg font-medium">
                    {selectedEmployee?.full_name || "John Doe"}
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
              className="w-full mt-4 justify-start text-left max-h-[calc(100vh-7.2rem)] h-[calc(100%-7.2rem)] flex flex-col"
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
                  <EmployeeDetailsTab
                    employeeDetails={selectedEmployee}
                    levelOptions={levelOptions}
                    roleOptions={roleOptions}
                  />
                </TabsContent>
                <TabsContent value="projects">
                  <ProjectsTab
                    employeeId={selectedEmployee?.id}
                    projectOptions={projectOptions}
                    roleOptions={roleOptions}
                    employeeProjects={selectedEmployee?.user_projects}
                  />
                </TabsContent>
                <TabsContent value="payroll">
                  <PayrollTab payrollData={selectedEmployee?.payroll || []} />
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
        roleOptions={roleOptions}
        levelOptions={levelOptions}
      />
    </main>
  );
}
