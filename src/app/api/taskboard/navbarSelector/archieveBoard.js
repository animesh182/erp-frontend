import { apiClient } from "@/lib/utils";

    export async function archeiveBoard(id) {
    try {
        const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/boards/${id}/archive/`, 
        {
            method: "PATCH",
            headers: {
            },
        }
        );
        return response; 
    } catch (error) {
        console.error("Failed to remove members", error);
        throw new Error("Failed to remove members");
    }
}

export async function unArcheiveBoard(id) {
    try {
        const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/boards/${id}/unarchive/`, 
        {
            method: "PATCH",
            headers: {
            },
        }
        );
        return response; 
    } catch (error) {
        console.error("Failed to remove members", error);
        throw new Error("Failed to remove members");
    }
}