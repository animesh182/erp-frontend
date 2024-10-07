
//may need to modify..

import { getTransactions } from "@/app/api/transactions/getTransactions";
import { useQuery } from "@tanstack/react-query";

export const useTransactions = () => useQuery({
  queryKey: ["transactions"],
  queryFn: getTransactions,
  select:(data)=>{
    let totalRevenue=0;
    let totalExpense=0;
    const transactionData= data.map((transaction)=>{    
    if(transaction.transaction_type==="Revenue")
        totalRevenue += parseInt(transaction.amount, 10);
    else if(transaction.transaction_type==="Expense")
        totalExpense += parseInt(transaction.amount, 10);
       
    return {
        name: transaction.name || "N/A",
        projectName: transaction.project_name || "N/A",
        invoice: "#"+transaction.id,
        invoiceIssuedDate: transaction?.issued_date 
        ? new Date(transaction.issued_date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', 
            year: 'numeric',
          })
        : "", 
        status: transaction.payment_status===2 ?"paid":
        transaction.payment_status===1 ?"pending":  "cancelled",
        paidDate: transaction?.payment_date 
        ? new Date(transaction.payment_date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', 
            year: 'numeric',
          })
        : "", 
        type:transaction?.payment_type===1?"One-Time": transaction?.payment_type===2?"Recurring":null,
        amount: transaction.amount,
        costType: transaction.transaction_type,
        id:transaction.id
      
    };
});
return {
  transactionData,
  totalRevenue,
  totalExpense,
};
},
});