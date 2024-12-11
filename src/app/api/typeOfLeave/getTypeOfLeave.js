import { apiClient } from "@/lib/utils";

    export async function getTypeOfLeave() {
    try {
        const response = await apiClient(
        `${process.env.NEXT_PUBLIC_API_URL}/api/type_of_leave/`
        );
        return { status: 200, data: response };
    } catch (error) {
        return {
        status: error.status || 500,
        message: error.message || "Failed to fetch type of leave",
        };
    }
    }