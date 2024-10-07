
import { getRevenue } from "@/app/api/revenue/getRevenue";
import { useQuery } from "@tanstack/react-query";

export const useRevenue = () => useQuery({
  queryKey: ["revenue"],
  queryFn: getRevenue,
  select: (data) => {
    return data.
    filter(item => item.invoice).
    map((revenue) => {
      const invoiceDetails = revenue.invoice_details || {};
      
      return {
        id:revenue.id ,
        name: invoiceDetails.name || "N/A",
        projectName: invoiceDetails.project_name || "N/A",
        invoice: "#"+invoiceDetails.id || "N/A",
        invoiceIssuedDate: invoiceDetails.issued_date 
          ? new Date(invoiceDetails.issued_date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short', 
              year: 'numeric',
            })
          : "", 
        paidDate: invoiceDetails.payment_date 
          ? new Date(invoiceDetails.payment_date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short', 
              year: 'numeric',
            })
          : "", 
        status: invoiceDetails.payment_status === 1 ? "unpaid" :
                invoiceDetails.payment_status === 2 ? "paid" : "cancelled",
        type: invoiceDetails.payment_type===1?"One-Time": invoiceDetails.payment_type===2?"Recurring":null, 
        amount: invoiceDetails.amount || 0,
      };
    });
  }
});
