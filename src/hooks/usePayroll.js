
import { getPayroll } from "@/app/api/payroll/getPayroll";
import { useQuery } from "@tanstack/react-query";

export const usePayroll = () => useQuery({
    queryKey: ["payroll"],
    queryFn:  getPayroll,
    select:(data)=>{
      console.log(data,"payroll data")
        return data.map((payroll)=>{
            return{
        name: payroll.invoice_details?.name || "N/A",
        projectName: payroll.invoice_details.project_name|| "N/A",
        invoice: payroll?.invoice,
        invoiceIssuedDate: payroll?.invoice_details?.issued_date 
        ? new Date(payroll.invoice_details.issued_date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', 
            year: 'numeric',
          })
        : null , 
        paidDate: payroll?.invoice_details?.payment_date 
        ? new Date(payroll.invoice_details.payment_date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short', 
            year: 'numeric',
          })
        : null, 
        status: payroll?.invoice_details?.payment_status===1? "paid": payroll?.invoice_details?.payment_status===2? "pending":
        "N/A",
        type: payroll?.invoice_details?.type || "N/A", 
        amount: payroll?.invoice_details?.amount || "N/A",
    }})
    }
})