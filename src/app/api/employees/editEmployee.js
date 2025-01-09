import { apiClient } from "@/lib/utils";

export async function editEmployee(employeeId, employeeData) {

  const transformedData = {
    employee_id: employeeData.employeeId,
      full_name: employeeData.fullName,
      email: employeeData.email,
      employee_id: employeeData.employeeId,
      salary: employeeData.salary,
      employment_type: employeeData.employeeType,
      role: employeeData.jobTitle,
      country: employeeData.country,
      phone_number: employeeData.phone,
      pan_number: employeeData.panNumber,
      supervisor: employeeData.supervisor,
      start_date: employeeData.startDate,
      end_date: employeeData.endDate || null,
      level: employeeData.level,
      gender: employeeData.gender,
      marital_status: employeeData.maritalStatus,
      linkedin_name: employeeData.linkedin_name,
      linkedin_url: employeeData.linkedInUrl,
      date_of_birth: employeeData.dateOfBirth,
    // Add any other fields that the API expects
  };

  try {
    const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${employeeId}/`,
        {
          method: "PATCH",
          body: JSON.stringify(transformedData),
        }
      );

    // Return the response data
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to edit employee information");
  }
}
