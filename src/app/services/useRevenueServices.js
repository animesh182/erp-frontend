import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRevenue } from "../api/revenue/createRevenue";
import { deleteRevenue } from "../api/revenue/deleteRevenue";
import { editRevenue } from "../api/revenue/editRevenue";

export const useAddRevenue = () => {
    return useMutation({
    mutationFn: async ( revenueData ) => {
            const transformedData = {
                invoice: {
                name: revenueData.name,
                amount: parseFloat(revenueData.amount),
                ...(revenueData.paidDate && { payment_date: revenueData.paidDate }),
                ...(revenueData.projectName && { project: revenueData.projectName }),
                payment_status: revenueData.status,
                payment_type: revenueData.type,
                transaction_type: "Revenue",
                invoice_no: revenueData.invoice,
                issued_date: revenueData.invoiceIssuedDate,
                },
                revenue_type: revenueData.revenueType,
            };
        const response = await createRevenue(transformedData);

        return response;
    },
    onSuccess: () => {
        toast.success("Revenue added successfully");
    },
    onError: (error) => {
        toast.error(error.message || "Failed to add revenue");
        console.error("Error adding revenue:", error);
    },
});
};



export const useEditRevenue = () => {
    const queryClient = useQueryClient();
    return useMutation({
    mutationFn: async ({ revenueId,revenueData} ) => {
            const transformedData = {
                invoice: {
                name: revenueData.name,
                amount: parseFloat(revenueData.amount),
                ...(revenueData.paidDate && { payment_date: revenueData.paidDate }),
                ...(revenueData.projectName && revenueData.projectName !== "N/A"
                    ? { project: revenueData.projectName }
                    : {}),
                payment_status: revenueData.status,
                payment_type: revenueData.type,
                transaction_type: "Revenue",
                invoice_no: revenueData.invoice,
                issued_date: revenueData.invoiceIssuedDate,
                },
                revenue_type: revenueData.revenueType,
            };
        const response = await editRevenue(revenueId,transformedData);

        return response;
    },
    onSuccess: () => {
        toast.success("Revenue edited successfully");
        queryClient.invalidateQueries(["revenue"]);
    },
    onError: (error) => {
        toast.error(error.message || "Failed to edit revenue");
        console.error("Error editing revenue:", error);
    },
});
};


    export const useDeleteRevenue = () => {
        
            return useMutation({
            mutationFn: (revenueId) => deleteRevenue(revenueId),
            onSuccess: () => {
                toast.success("Revenue deleted successfully");            
            },
            onError: (error) => {
                toast.error("There was an error deleting revenue");
                console.error("There was an error deleting revenue:", error);
            }
            });
        };