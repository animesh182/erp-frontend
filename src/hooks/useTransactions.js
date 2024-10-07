
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
        : "No payment Date", 
        status: transaction.payment_status===2 ?"paid": "pending",
        paidDate: transaction?.payment_date 
        ? new Date(transaction.payment_date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', 
            year: 'numeric',
          })
        : "No payment Date", 
        type: transaction.payment_type===1?"Online Payment":"N/A",
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