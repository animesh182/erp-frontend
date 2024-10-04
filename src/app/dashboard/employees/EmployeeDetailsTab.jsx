"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { formatAmountToNOK } from "@/lib/utils";
import { useState } from "react";
import { EditEmployeeSheet } from "@/components/EditEmployeeSheet";
import { toast } from "sonner";

const EmployeeDetailsTab = ({ employeeDetails }) => {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  if (!employeeDetails) {
    return <div>Loading employee details...</div>;
  }

  const basicDetails = [
    { label: "Employee ID", value: employeeDetails?.id },
    // {
    //   label: "Date of Birth",
    //   value: format(new Date(employeeDetails?.dateOfBirth), "MMM dd yyyy"),
    // },
    // { label: "Gender", value: employeeDetails?.gender },
    // {
    //   label: "Marital Status",
    //   value: employeeDetails?.maritalStatus,
    // },
  ];

  const contactInformation = [
    { label: "Country", value: employeeDetails?.country },
    { label: "Phone", value: employeeDetails?.phone_number },
    { label: "Email", value: employeeDetails?.email },
    // {
    //   label: "LinkedIn",
    //   value: employeeDetails?.linkedInName,
    //   link: employeeDetails?.linkedInUrl,
    // },
  ];

  const employmentDetails = [
    {
      label: "Job Title",
      value: employeeDetails?.role_title,
    },
    // { label: "Level", value: employeeDetails?.level }, level api is not working
    // { label: "Department", value: employeeDetails?.department },
    {
      label: "Employee Type",
      value: employeeDetails?.employment_type,
    },
    // { label: "Supervisor", value: employeeDetails?.supervisor },
  ];

  const compensationAndBenefits = [
    {
      label: "Salary",
      value: `${formatAmountToNOK(employeeDetails?.salary)} per month`,
    },
    { label: "PAN Number", value: employeeDetails?.PAN },
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

  const handleEditEmployee = (updatedData) => {
    // Handle the updated employee data here
    toast.success("Employee edited successfully");
    console.log("Updated employee data:", updatedData);
    // You might want to update the state or send this data to an API
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
