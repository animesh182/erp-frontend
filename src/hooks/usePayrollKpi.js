import { getPayrollKpi } from "@/app/api/payroll/getPayrollKpi";
import { formatAmountToNOK } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, DollarSign } from "lucide-react";

export const usePayrollKpi=()=> useQuery({
    queryKey:["payrollkpi"],
    queryFn:getPayrollKpi,
    select:(data)=>{
        
          
        return [
            {
              title: "Total Outstanding",
              value: (data.total_outstanding),
              subtitle: "Total outstanding invoices",
              icon: <DollarSign className="h-4 w-4" />,
            },
            {
              title: "Upcoming Payment",
              value: (data.upcoming_payroll.total_amount),
              subtitle: "Next payment due",
              icon: <CreditCard className="h-4 w-4" />,
            },
            {
              title: "Previous Payroll",
              value: (data.previous_payroll.total_amount),
              subtitle: "Last payroll amount",
              icon: <DollarSign className="h-4 w-4" />,
            },
          ];
        },
      });