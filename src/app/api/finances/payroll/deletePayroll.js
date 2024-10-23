import { deleteApiClient } from "@/lib/utils";

export async function deletePayroll(payrollId) {
  try {
    const result = await deleteApiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoiced_salary/${payrollId}/`,
      {
        method: "DELETE",
      }
    );

    if (result === true) {
      return { success: true, message: "Payroll deleted successfully" };
    } else {
      throw new Error("Unexpected response from server");
    }
  } catch (error) {
    console.error("Error deleting payroll:", error);
    return {
      success: false,
      message: error.message || "Failed to delete payroll",
    };
  }
}
