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
export async function getSalaryPayementHistory() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}api/invoiced_salary/`
    );
    return { status: 200, data: response };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch the invoiced salary.",
    };
  }
}

export async function getEmployeesWithRoles() {
  try {
    const [employeesResponse, rolesResponse, salaryPaymentResponse] =
      await Promise.all([
        getEmployees(),
        getRoles(),
        getSalaryPayementHistory(),
      ]);

    if (employeesResponse.status !== 200) {
      throw new Error("Failed to fetch employee details");
    }
    if (rolesResponse.status !== 200) {
      throw new Error("Failed to fetch employee roles");
    }
    if (salaryPaymentResponse.status !== 200) {
      throw new Error("Failed to fetch employee salaries");
    }
    const employees = employeesResponse.data;
    const roles = rolesResponse.data;
    const salaryPayment = salaryPaymentResponse.data;
    const rolesMap = new Map(roles.map((role) => [role.id, role.title]));
    // const salaryPaymentMap = new Map(salaryPayment.map())
    const employeesWithRoles = employees.map((employee) => {
      const roleTitle = rolesMap.get(employee.role) || "Unknown Role"; // Handle unknown roles
      const salaryHistory = salaryPayment.filter(
        (salary) => salary.user === employee.employee_id
      );
      return {
        ...employee,
        role_title: roleTitle,
        salary_payment_history: salaryHistory,
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
