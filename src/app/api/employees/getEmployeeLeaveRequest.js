<<<<<<< HEAD
// import { apiClient } from "@/lib/utils";

// export async function getEmployeeLeaveRequest(userId) {
//     try {
//         const response = await apiClient(
//             `${process.env.NEXT_PUBLIC_API_URL}api/users/employee-details/${userId}`
//         );
//         request
//     }

// }
=======
import { apiClient } from "@/lib/utils";

export async function getEmployeeLeaveRequest(userId) {
    try {
      const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leave_records/${userId}/`
      );
      return  response;
    } catch (error) {
      return {
        status: error.status || 500,
        message: error.message || "Failed to fetch the employee's leave request",
      };
    }
  }
>>>>>>> 583eaaeb20d049874a6140088f55d1dcf1eb716a
