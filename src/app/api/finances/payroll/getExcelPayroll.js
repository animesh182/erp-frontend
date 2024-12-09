// import { apiClient } from "@/lib/utils";
import Cookies from "js-cookie";

export async function getExcelPayroll() {
    console.log('hi')
      let token = Cookies.get("access_token");
      console.log('token',token)

      const defaultHeaders = {
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      try {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate_employee_excel/`, {
          method: 'GET', // Ensure that the method is correct, either GET or POST as per your API
          headers: {
            ...defaultHeaders,
          },
        });
  
        if (response.status === 401) {
          const errorData = await response.json();
          if (errorData.code === "token_not_valid") {
            token = await refreshToken();
            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/generate_employee_excel/`, {
              method: 'GET', // Adjust if needed
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }
        }
  
        if (!response.ok) {
          throw new Error("An error occurred while fetching the file.");
        }
  
        // The response should contain the binary data of the Excel file
        const blob = await response.blob();  // Get the file as Blob (binary large object)
  
        // Create a link element and trigger the download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "employee_payroll.xlsx";  // Specify the name of the file
        document.body.appendChild(a);
        a.click();  // Programmatically click the link to trigger the download
        a.remove();  // Remove the link element after downloading
  
      } catch (error) {
        console.error("API Request Failed:", error.message);
        throw new Error(
          error.message || "An error occurred while processing the request"
        );
      }
    }