import { useMutation } from "@tanstack/react-query";
import { updatePayroll } from "../api/finances/payroll/updatePayroll";
import { toast } from "sonner";
import { deletePayroll } from "../api/finances/payroll/deletePayroll";

export const useEditPayroll = () => {
    return useMutation({
    mutationFn: async ({ id, formData }) => {
        const transformedData = {
            description: formData.name,
            invoice_issued_date: formData.invoiceIssuedDate,
            payment_date: formData.paidDate,
            payment_status: formData.status === "paid" ? "Paid" : "Pending",
            type: formData.type,
            amount: formData.amount,
        };
        const response = await updatePayroll(id, transformedData);

        return response;
    },
    onSuccess: () => {
        toast.success('Payroll updated successfully');
    },
    onError: (error) => {
        toast.error(error.message || 'Failed to edit payroll');
        console.error('Error editing payroll:', error);
    },
    });
};



    export const useDeletePayroll = () => {
        
            return useMutation({
            mutationFn: (payrollId) => deletePayroll(payrollId),
            onSuccess: () => {
                toast.success("Payroll deleted successfully");            
            },
            onError: (error) => {
                toast.error("There was an error deleting payroll");
                console.error("There was an error deleting payroll:", error);
            }
            });
        };