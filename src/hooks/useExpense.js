

import { getExpenses } from "@/app/api/expense/getExpense";
import { useQuery } from "@tanstack/react-query";

export const useExpense = (startDate,endDate) => useQuery({
  queryKey: ["expenses"],
  queryFn: ()=>getExpenses(startDate,endDate),
  select: (data) => {
    return data.map((expense) => {
      const invoiceDetails = expense.invoice_details;
    
      return {
        name: invoiceDetails?.name || "N/A", 
        projectName: invoiceDetails?.project_name || "N/A",  
        invoice: invoiceDetails?.id?`#${invoiceDetails.id}`: 0,
     
        invoiceIssuedDate: invoiceDetails?.issued_date 
          ? new Date(invoiceDetails.issued_date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short', 
              year: 'numeric',
            })
          : "No Issued Date", 
        paidDate: invoiceDetails?.payment_date
          ? new Date(invoiceDetails.payment_date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short', 
              year: 'numeric',
            })
          : "Not Paid",
        status: invoiceDetails?.payment_status === 1
          ? "paid"
          : invoiceDetails?.payment_status === 2
          ? "pending"
          : "cancelled",
        costType: expense.cost_type === 1 ? "direct-cost" :
          expense.cost_type === 2 ? "npa-cost" :
          expense.cost_type === 3 ? "fixed-cost" :
          expense.cost_type === 4 ? "freelance" :
          expense.cost_type === 5 ? "overtime" :
         "salary", 
        amount: Number(invoiceDetails?.amount) || 0, 
        type: (invoiceDetails?.type || "N/A").replace(/\s+/g, '-').toLowerCase(),
       
        
       
      };
    });
  },
});
