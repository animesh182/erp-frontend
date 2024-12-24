import { useMutation } from "@tanstack/react-query";
import { createExpense } from "../api/expense/createExpense";
import { toast } from "sonner";
import { editExpense } from "../api/expense/editExpense";
import { deleteExpense } from "../api/expense/deleteExpense";

export const useAddExpense = () => {
    return useMutation({
    mutationFn: async ( expenseData ) => {
            const transformedData = {
                invoice: {
                name: expenseData.name,
                amount: parseFloat(expenseData.amount),
                issued_date: expenseData.invoiceIssuedDate,
                ...(expenseData.projectName && { project: expenseData.projectName }),
                payment_status: expenseData.status,
                ...(expenseData.paidDate && { payment_date: expenseData.paidDate }),
                payment_type: expenseData.type, 
                transaction_type: "Expense",
                invoice_no: expenseData.invoice,
                },
                cost_type: expenseData.costType?.replace("-", " "),
            };
        const response = await createExpense(transformedData);

        return response;
    },
    onSuccess: () => {
        toast.success("Expense added successfully");
    },
    onError: (error) => {
        toast.error(error.message || "Failed to add expense");
        console.error("Error adding expense:", error);
    },
});
};



export const useEditExpense = () => {
    return useMutation({
    mutationFn: async ({ expenseId,expenseData} ) => {
            const transformedData = {
                invoice: {
                name: expenseData.name,
                amount: parseFloat(expenseData.amount),
                issued_date: expenseData.invoiceIssuedDate,
                ...(expenseData.projectName && expenseData.projectName !== "N/A"
                    ? { project: expenseData.projectName }
                    : {}),
                payment_status: expenseData.status,
                ...(expenseData.paidDate && { payment_date: expenseData.paidDate }),
                payment_type: expenseData.type,
                transaction_type: "Expense",
                invoice_no: expenseData.invoice,
                },
                cost_type: expenseData.costType?.replace("-", " "),
            };
        const response = await editExpense(expenseId,transformedData);

        return response;
    },
    onSuccess: () => {
        toast.success("Expense edited successfully");
    },
    onError: (error) => {
        toast.error(error.message || "Failed to edit expense");
        console.error("Error editing expense:", error);
    },
});
};


    export const useDeleteExpense = () => {
        
            return useMutation({
            mutationFn: (expenseId) => deleteExpense(expenseId),
            onSuccess: () => {
                toast.success("Expense deleted successfully");            
            },
            onError: (error) => {
                toast.error("There was an error deleting expense");
                console.error("There was an error deleting expense:", error);
            }
            });
        };