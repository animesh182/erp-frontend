"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { formatAmountToNOK } from "@/lib/utils";
import { useState } from "react";
import { EditEmployeeSheet } from "@/components/EditEmployeeSheet";
import { toast } from "sonner";
import { apiClient } from "@/lib/utils";
const EmployeeDetailsTab = ({ employeeDetails, levelOptions, roleOptions }) => {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  if (!employeeDetails) {
    return <div>Loading employee details...</div>;
  }

  const basicDetails = [
    { label: "Employee ID", value: employeeDetails?.employee_id },
    {
      label: "Date of Birth",
      value: employeeDetails?.date_of_birth
        ? format(new Date(employeeDetails?.date_of_birth), "MMM dd yyyy")
        : "N/A",
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

  // console.log(employeeDetails, "ed");
  const handleEditEmployee = async (formData) => {
    const employeeId = employeeDetails.id; // Extract employee ID from employeeData
    // Generate a new ID (you might want to use a more robust method in production)
    const payload = {
      employee_id: formData.employeeId,
      full_name: formData.fullName,
      email: formData.email,
      password: "avinto123",
      employee_id: formData.employeeId,
      salary: formData.salary,
      employment_type: formData.employeeType,
      role: formData.jobTitle,
      country: formData.country,
      phone_number: formData.phone,
      PAN: formData.panNumber,
      start_date: formData.startDate,
      end_date: formData.endDate || null,
      level: formData.level,
      gender: formData.gender,
      marital_status: formData.maritalStatus,
      linkedin_name: formData.linkedInName,
      linkedin_url: formData.linkedInUrl,
      date_of_birth: formData.dateOfBirth,
    };
    try {
      const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}api/users/${employeeId}/`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );
      console.log(response, "response");
      if (response.ok) {
        toast.success("Employee edited successfully");
        // setIsSheetOpen(false);
      }
    } catch (error) {
      toast.error("There was an error adding the employee");
      console.error(error);
    }

    // const newId = `employee_${Date.now()}`;
    // const newEmployee = {
    //   formData,
    // };
    // setEmployeeDetails([...employeeDetails, newEmployee]);
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

export default EmployeeDetailsTab;
