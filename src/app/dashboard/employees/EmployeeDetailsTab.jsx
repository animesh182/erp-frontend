"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { formatAmountToNOK } from "@/lib/utils";
import { useState } from "react";
import { EditEmployeeSheet } from "@/components/EditEmployeeSheet";
import { toast } from "sonner";
import { useUpdateEmployee } from "@/sevices/useEmployeeServices";
import { useEmployees } from "@/hooks/useEmployees";

const EmployeeDetailsTab = ({ employeeDetails }) => {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const { mutate:editEmployee } = useUpdateEmployee();
  if (!employeeDetails) {
    return <div>Loading employee details...</div>;
  }

  const basicDetails = [
    { label: "Employee ID", value: employeeDetails?.employeeId },
    {
      label: "Date of Birth",
      value: format(new Date(employeeDetails?.dateOfBirth), "MMM dd yyyy"),
    },
    { label: "Gender", value: employeeDetails?.gender },
    {
      label: "Marital Status",
      value: employeeDetails?.maritalStatus,
    },
  ];

  const contactInformation = [
    { label: "Country", value: employeeDetails?.country },
    { label: "Phone", value: employeeDetails?.phone },
    { label: "Email", value: employeeDetails?.email },
    {
      label: "LinkedIn",
      value: employeeDetails?.linkedInName,
      link: employeeDetails?.linkedInUrl,
    },
  ];

  const employmentDetails = [
    {
      label: "Job Title",
      value: employeeDetails?.jobTitle,
    },
    { label: "Level", value: employeeDetails?.level },
    { label: "Department", value: employeeDetails?.department },
    {
      label: "Employee Type",
      value: employeeDetails?.employeeType,
    },
    { label: "Supervisor", value: employeeDetails?.supervisor },
  ];

  const compensationAndBenefits = [
    {
      label: "Salary",
      value: `${formatAmountToNOK(employeeDetails?.salary)} per month`,
    },
    { label: "PAN Number", value: employeeDetails?.panNumber },
  ];

  const renderDetailItem = ({ label, value, link }) => (
    <div key={label} className="flex justify-between items-center">
      <label className="text-sm text-muted-foreground">{label}</label>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="font-medium">{value}</p>
      )}
    </div>
  );

  const roles = [
    { id: 1, title: "UIUX Developer" },
    { id: 2, title: "Frontend Developer" },
    { id: 3, title: "Backend Developer" },
    { id: 4, title: "Human Resource" },
    { id: 5, title: "Project Manager" },
    { id: 6, title: "Data Analyst" },
    { id: 7, title: "Executive Director" },
    { id: 8, title: "React JS Developer" },
    { id: 9, title: "QA Analyst" }
  ];

  
  const handleEditEmployee = (updatedData) => {
    const selectedRole = roles.find(role => role.title === updatedData.jobTitle);
    const transformedData = {
      // id: updatedData.userId,
      date_of_birth:updatedData.dateOfBirth,
      gender:updatedData.gender.toLowerCase(),
      marital_status:updatedData.maritalStatus.toLowerCase(),
      country: updatedData.country,
      phone_number: updatedData.phone,
      full_name: updatedData.employeeName,
      email: updatedData.email,
      linkedin_name:updatedData.linkedInName,
      linkedin_url:updatedData.linkedInUrl,
      role: selectedRole ? selectedRole.id : null, 
      level: updatedData.level ? updatedData.level.charAt(1) : "N/A",
      employment_type: updatedData.employeeType.toLowerCase(),
      salary: updatedData.salary,
      PAN: updatedData.panNumber,
      department:updatedData.department,
      
      employee_id: updatedData.employeeId,
    };
    editEmployee(transformedData)
   
    toast.success("Employee edited successfully");

  };

  return (
    <div className="flex flex-col p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-xl">Employee Details</div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setIsEditSheetOpen(true)}
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="flex w-full justify-between border rounded-lg p-6">
        <div className="flex w-full justify-between rounded-lg ">
          <div className="flex flex-col w-1/2 pr-6 space-y-4">
            <div className="font-normal text-base">Basic Details</div>
            <div className="space-y-2">
              {basicDetails.map(renderDetailItem)}
            </div>
          </div>
          <Separator orientation="vertical" className="mx-6" />
          <div className="flex flex-col w-1/2 pl-6 space-y-4">
            <div className="font-normal text-base">Contact Information</div>
            <div className="space-y-2">
              {contactInformation.map(renderDetailItem)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between border rounded-lg p-6">
        <div className="flex w-full justify-between rounded-lg">
          <div className="flex flex-col w-full space-y-4">
            <div className="font-normal text-base">Employment Details</div>
            <div className="space-y-2">
              {employmentDetails.map(renderDetailItem)}
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between border rounded-lg p-6">
        <div className="flex w-full justify-between rounded-lg">
          <div className="flex flex-col w-full space-y-4">
            <div className="font-normal text-base">Compensation & Benefits</div>
            <div className="space-y-2">
              {compensationAndBenefits.map(renderDetailItem)}
            </div>
          </div>
        </div>
      </div>
      <EditEmployeeSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        employeeData={employeeDetails}
        onEditEmployee={handleEditEmployee}
      />
    </div>
  );
};

export default EmployeeDetailsTab;
