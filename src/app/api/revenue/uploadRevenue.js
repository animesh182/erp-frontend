import Cookies from "js-cookie";

export async function uploadRevenue(file) { 
    try {
        const formData = new FormData();
        formData.append("file", file);

        let token = Cookies.get("access_token");

            const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/upload_revenue_excel/`,
            {
                method: "POST",
                body: formData,
                headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
                // Content-Type is automatically set by the browser for FormData
                },
            }
            );


        
        if (response.status === 500) {
            const errorData = await response.json();
            throw new Error(errorData.details || "Writing revenue to database failed");
        }

        if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Something wrong with the file");
        }

        return await response.json();
    }
    

    
    catch (error) {
        console.error("Error uploading revenue:", error);
        throw new Error(error.message || "Failed to upload revenue");
    }

}
