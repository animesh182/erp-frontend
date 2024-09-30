import { getKpi } from "@/app/api/finance-kpi/getKpi";
import { useQuery } from "@tanstack/react-query";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

export const useKpi=()=>useQuery({
    queryKey:["kpi"],
    queryFn:getKpi,
    select:(data)=>{
        return [
            {
                title: "Total Revenue",
                value: data.total_revenue_current_month,
                change: data.percentage_change_in_revenue,
                period: "month",
                icon: <DollarSign className="w-4 h-4" />,
              },
            {
                title: "Total Expense",
                value: data.total_expenses_current_month,
                change: data.percentage_change_in_expenses,
                period: "month",
                icon: <DollarSign className="w-4 h-4" />,
              },
              {
                title: "Total Profit",
                value: data.total_profit_current_month,
                change: data.percentage_change_in_profit,
                period: "month",
                icon: <Activity />,
              },
              {
                title: "Projects",
                value: data.num_projects_current_month,
                change: data.percentage_change_in_num_projects,
                period: "month",
                icon: <Users />,
                isMoney: false,
              },
              {
                title: "Employees",
                value: data.num_employees,
                change: data.employees_percentage_change,
                period: "month",
                icon: <CreditCard />,
                isMoney: false,
              },
              {
                title: "Profit Growth",
                value: 0,
                change: 0,
                period: "month",
                icon: <DollarSign />,
              },
              {
                title: "Expected Revenue",
                value: 0,
                period: "upcoming month",
                icon: <Activity />,
            
                isTrend: false,
              },
              {
                title: "Expected Cost",
                value: 0,
                period: "upcoming month",
                icon: <Users />,
                isTrend: false,
              },
              {
                title: "Expected Liquidity",
                value: 0,
                period: "upcoming month",
                icon: <CreditCard />,
                isTrend: false,
              },
          ];
    }
})