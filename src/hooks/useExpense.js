

import { getExpenses } from "@/app/api/expense/getExpense";
import { useQuery } from "@tanstack/react-query";

export const useExpense = () => useQuery({
  queryKey: ["expenses"],
  queryFn: ()=>getExpenses(),
  select: (data) => {
    return data.map((expense) => {
      const invoiceDetails = expense.invoice_details;
    
      return {
        id:expense?.id,
        name: invoiceDetails?.name || "N/A", 
        projectName: invoiceDetails?.project_name || "N/A",  
        invoice: invoiceDetails?.id?`#${invoiceDetails.id}`: 0,
     
        invoiceIssuedDate: invoiceDetails?.issued_date 
          ? new Date(invoiceDetails?.issued_date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short', 
              year: 'numeric',
            })
          : "",
        paidDate: invoiceDetails?.payment_date
          ? new Date(invoiceDetails.payment_date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short', 
              year: 'numeric',
            })
          : "",
          status: invoiceDetails?.payment_status === 1 ? "unpaid" :
          invoiceDetails?.payment_status === 2 ? "paid" : "cancelled",
        costType: expense.cost_type === 1 ? "direct-cost" :
          expense.cost_type === 2 ? "npa-cost" :
          expense.cost_type === 3 ? "fixed-cost" :
          expense.cost_type === 4 ? "freelance" :
          expense.cost_type === 5 ? "overtime" :
         "salary", 
        amount: Number(invoiceDetails?.amount) || 0, 
        type:invoiceDetails?.payment_type===1?"One-Time": invoiceDetails?.payment_type===2?"Recurring":null, 
            
        
       
      };
    });
  },
});
