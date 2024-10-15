import { apiClient } from "@/lib/utils";

export async function createEmployee(employeeData) {
  console.log(employeeData, "employeeData");

  // Transform the employeeData structure
  const transformedData = {
    employee_id: employeeData.employeeId,
    date_of_birth: employeeData.dateOfBirth,
    gender: employeeData.gender,
    marital_status: employeeData.maritalStatus,
    password: "klololo",
    country: employeeData.country,
    start_date: employeeData.startDate,
    end_date: employeeData.endDate,
    phone: employeeData.phone,
    email: employeeData.email,
    full_name: employeeData.fullName,
    linkedin_url: employeeData.linkedInUrl,
    role: employeeData.jobTitle,
    level: employeeData.level,
    department: employeeData.department,
    employment_type: employeeData.employeeType,
    supervisor: employeeData.supervisor,
    salary: parseFloat(employeeData.salary),
    pan_number: employeeData.panNumber,
  };

  try {
    console.log(transformedData, "transformedData");
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/register/`,
      {
        method: "POST",
        body: JSON.stringify(transformedData),
      }
    );

    // Return the response data
    return response;
  } catch (error) {
    throw new Error(error.message || "Failed to create employee");
  }
}
