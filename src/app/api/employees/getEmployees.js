import { apiClient } from "@/lib/utils";

// Function to fetch employees
export async function getEmployees() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/employee-details/`
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/roles/`
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoiced_salary/`
    );
    return { status: 200, data: response };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch the invoiced salary.",
    };
  }
}
export async function getLevels() {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/levels/`
    );
    return { status: 200, data: response };
  } catch (error) {
    return {
      status: error.status || 500,
      message: error.message || "Failed to fetch the invoiced salary.",
    };
  }
}

// export async function getEmployeesWithRoles() {
//   try {
//     const [
//       employeesResponse,
//       rolesResponse,
//       salaryPaymentResponse,
//       levelResponse,
//     ] = await Promise.all([
//       getEmployees(),
//       getRoles(),
//       getSalaryPayementHistory(),
//       getLevels(),
//     ]);

//     if (employeesResponse.status !== 200) {
//       throw new Error("Failed to fetch employee details");
//     }
//     if (rolesResponse.status !== 200) {
//       throw new Error("Failed to fetch employee roles");
//     }
//     if (salaryPaymentResponse.status !== 200) {
//       throw new Error("Failed to fetch employee salaries");
//     }
//     if (levelResponse.status !== 200) {
//       throw new Error("Failed to fetch employee levels");
//     }
//     const employees = employeesResponse.data;
//     const roles = rolesResponse.data;
//     const salaryPayment = salaryPaymentResponse.data;
//     const levels = levelResponse.data;
//     const rolesMap = new Map(roles.map((role) => [role.id, role.title]));
//     // const salaryPaymentMap = new Map(salaryPayment.map())
//     const employeesWithRoles = employees.map((employee) => {
//       const roleTitle = rolesMap.get(employee.role) || "Unknown Role"; // Handle unknown roles
//       const salaryHistory = salaryPayment.filter(
//         (salary) => salary.user === employee.employee_id
//       );
//       const levelTitle =
//         levels.find((level) => employee.level === level.id)?.description ||
//         "N/A";

//       return {
//         ...employee,
//         role_title: roleTitle,
//         salary_payment_history: salaryHistory,
//         level_title: levelTitle,
//       };
//     });
//     return { status: 200, data: employeesWithRoles };
//   } catch (error) {
//     return {
//       status: error.status || 500,
//       message:
//         error.message ||
//         "Failed to fetch and merge employee details with roles",
//     };
//   }
// }
