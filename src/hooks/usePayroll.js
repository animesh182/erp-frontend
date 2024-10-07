
import { getPayroll } from "@/app/api/payroll/getPayroll";
import { useQuery } from "@tanstack/react-query";

export const usePayroll = () => useQuery({
    queryKey: ["payroll"],
    queryFn:  getPayroll,
    select:(data)=>{
      console.log(data,"payroll data")
      return data
      .filter(item => item.invoice_issued_date) 
      .map(data => ({
        name:  "N/A",
        projectName: "N/A",
        invoice: "#"+data?.id,
        invoiceIssuedDate: data?.invoice_issued_date 
        ? new Date(data.invoice_issued_date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', 
            year: 'numeric',
          })
        : null , 
        paidDate: data?.payment_date
        ? new Date(data.payment_date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', 
            year: 'numeric',
          })
        : null, 
        status: data?.payment_status || "N/A",
        type: data?.type || "N/A", 
        amount: data?.amount || "N/A",
        id:data?.id
    }));
},
});