"use client";

import { editEmployee } from "@/app/api/employees/editEmployee";
import { EditEmployeeSheet } from "@/components/EditEmployeeSheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatAmountToNOK } from "@/lib/utils";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/utils";
import { TitleSkeleton, DetailsSkeleton } from "@/components/Skeletons";

const EmployeeDetailsTab = ({ employeeDetails, levelOptions, roleOptions,setEmployeeDetails,onRefresh }) => {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  if (!employeeDetails) {
    return (
      <div className="flex flex-col space-y-4 p-6">
        <TitleSkeleton />
        <DetailsSkeleton /> {/* Basic Details skeleton */}
        <DetailsSkeleton /> {/* Contact Information skeleton */}
        <DetailsSkeleton /> {/* Employment Details skeleton */}
      </div>
    );
  }

  const basicDetails = [
    { label: "Employee ID", value: employeeDetails?.employee_id },
    // {
    //   label: "Date of Birth",
    //   value: employeeDetails?.date_of_birth
    //     ? format(new Date(employeeDetails?.date_of_birth), "MMM dd yyyy")
    //     : "N/A",
    // },
    {
      label: "Date of Birth",
      value: employeeDetails?.date_of_birth==="N/A" || !employeeDetails?.date_of_birth
        ?"N/A": format(new Date(employeeDetails?.date_of_birth), "MMM dd yyyy")
   
    },
    { label: "Gender", value: employeeDetails?.gender || "N/A" },
    {
      label: "Marital Status",
      value: employeeDetails?.marital_status || "N/A",
    },
  ];

  const contactInformation = [
    { label: "Country", value: employeeDetails?.country },
    { label: "Phone", value: employeeDetails?.phone_number },
    { label: "Email", value: employeeDetails?.email },
    {
      label: "LinkedIn",
      value: employeeDetails?.fullName,
      link: employeeDetails?.linkedInUrl,
    },
  ];

  const employmentDetails = [
    {
      label: "Job Title",
      value: employeeDetails.role,
    },
    { label: "Level", value: employeeDetails?.level },
    { label: "Department", value: employeeDetails?.department || "N/A" },
    {
      label: "Employee Type",
      value: employeeDetails?.employment_type,
    },
    { label: "Supervisor", value: employeeDetails?.supervisor || "N/A" },
  ];

  const compensationAndBenefits = [
    {
      label: "Salary",
      value: `${formatAmountToNOK(employeeDetails?.salary)} per month`,
    },
    { label: "PAN Number", value: employeeDetails?.pan_number },
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


  const handleEditEmployee = async (formData) => {
    try {
      const employeeId = employeeDetails.id; 
      const response = await editEmployee(employeeId, formData);
      if (response.success) {
              toast.success(response.success);
              setEmployeeDetails((prevDetails) => ({
                ...prevDetails,
                ...formData,
              }));
              if(onRefresh){
                onRefresh()
              }
            }
    } catch (error) {
      toast.error(error.message || "There was an error adding the employee");
    }
  };




  return (
    <div className="flex flex-col p-6 space-y-4 capitalize">
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
        levelOptions={levelOptions}
        roleOptions={roleOptions}
      />
    </div>
  );
};

export default EmployeeDetailsTab
