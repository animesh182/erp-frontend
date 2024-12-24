import { deleteApiClient } from "@/lib/utils";

export async function deleteAssignedProject(userProjectId) {
  try {
    const result = await deleteApiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user_projects/delete/?id=${userProjectId}`,
      {
        method: "DELETE",
      }
    );

      return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      success: false,
      message: error.message || "Failed to delete project",
    };
  }
}
