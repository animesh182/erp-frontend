import { apiClient } from "@/lib/utils";

    export async function removeMembersToBoard(id) {
    try {
        const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user_projects/?user_id=${id}/`, 
        {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
        }
        );
        return response; 
    } catch (error) {
        console.error("Failed to remove members", error);
        throw new Error("Failed to remove members");
    }
}