import { apiClient } from "@/lib/utils";

    // export async function fetchKpiData(startDate, endDate,project) {
    //     console.log(project,"projectsad")
    // try {
    //     if (startDate && endDate) {
    //     console.log("fetching data from", startDate, "to", endDate, "api");
    //     const encodedProject = encodeURIComponent(project);
    //     const response = await apiClient(
    //         `${process.env.NEXT_PUBLIC_API_URL}/api/finance_kpis/?start_date=${startDate}&end_date=${endDate}&project=${encodedProject}`
    //     );
    //     // Return the response data
    //     return { status: 200, data: response };
    //     } else {
    //     console.log("dates are not provided");
    //     const response = await apiClient(
    //         `${process.env.NEXT_PUBLIC_API_URL}/api/finance_kpis/`
    //     );
    //     // Return the response data
    //     return { status: 200, data: response };
    //     }
    // } catch (error) {
    //     return {
    //     status: error.status || 500,
    //     message: error.message || "Failed to fetch dashboard KPI data",
    //     };
    // }
    // }


        export async function fetchKpiData(startDate, endDate, project) {
            console.log(project,"prkp")
            try {
            if (startDate && endDate) {
                
                // Construct URL conditionally
                let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/finance_kpis/?start_date=${startDate}&end_date=${endDate}`;
                
                if (project) {
                const encodedProject = encodeURIComponent(project);
                apiUrl += `&project=${encodedProject}`;
                }
        
                const response = await apiClient(apiUrl);
        
                // Return the response data
                return { status: 200, data: response };
            } else {
                console.log("dates are not provided");
                const response = await apiClient(
                `${process.env.NEXT_PUBLIC_API_URL}/api/finance_kpis/`
                );
                // Return the response data
                return { status: 200, data: response };
            }
            } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || "Failed to fetch dashboard KPI data",
            };
            }
        }
        