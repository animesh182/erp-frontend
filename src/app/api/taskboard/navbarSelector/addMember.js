import { apiClient } from "@/lib/utils";

    export async function addMembersToBoard(id) {
    try {
        const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user_projects/?user_id=${id}/`, 
        {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            },
        }
        );
        return response; 
    } catch (error) {
        console.error("Failed to add members", error);
        throw new Error("Failed to add members");
    }
    }
