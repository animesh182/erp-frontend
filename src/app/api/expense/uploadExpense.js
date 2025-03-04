import Cookies from "js-cookie";

export async function uploadExpense(file) { 
    try {
        const formData = new FormData();
        formData.append("file", file);

        let token = Cookies.get("access_token");

            const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/upload_expense_excel/`,
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
            throw new Error(errorData.details || "Writing expenses to database failed");
        }

        if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.details[0]?.details?.invoice?.amount[0] || errorData.details || "Something wrong with the file");
        }

        return await response.json();
    }
    

    
    catch (error) {
        console.error("Error uploading expense:", error);
        throw new Error(error || "Failed to upload expense");
    }

}

// async function refreshToken() {
//   try {
//     const refreshToken = Cookies.get("refresh_token");

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ refresh: refreshToken }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to refresh token");
//     }

//     const data = await response.json();
//     Cookies.set("access_token", data.access, { expires: 1 });
//     return data.access;
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     throw error;
//   }
// }



