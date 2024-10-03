import { apiClient } from "@/lib/utils";

// Function to fetch employees
export async function getEmployees() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}api/users/employee-details/`
    );
    return { status: 200, data: response.data };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch the employee details",
    };
  }
}

// Function to fetch roles
export async function getRoles() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}api/roles/`
    );
    return { status: 200, data: response };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch the role details",
    };
  }
}

export async function getEmployeesWithRoles() {
  try {
    const [employeesResponse, rolesResponse] = await Promise.all([
      getEmployees(),
      getRoles(),
    ]);

    if (employeesResponse.status !== 200 || rolesResponse.status !== 200) {
      throw new Error("Failed to fetch data");
    }

    const employees = employeesResponse.data;
    // console.log(employees, "employees");
    const roles = rolesResponse.data;
    // console.log(roles, "roles");

    const rolesMap = new Map(roles.map((role) => [role.id, role.title]));
    // console.log(rolesMap);
    const employeesWithRoles = employees.map((employee) => {
      const roleTitle = rolesMap.get(employee.role) || "Unknown Role"; // Handle unknown roles
      return {
        ...employee,
        role_title: roleTitle,
      };
    });

    return { status: 200, data: employeesWithRoles };
  } catch (error) {
    return {
      status: error.status || 500,
      message:
        error.message ||
        "Failed to fetch and merge employee details with roles",
    };
  }
}
