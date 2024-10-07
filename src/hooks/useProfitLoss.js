import { getProfitLoss } from "@/app/api/profit-loss/getProfitLoss";
import { useQuery } from "@tanstack/react-query";


export const useProfitLoss=(year)=>useQuery({
    queryKey:["profitloss",year],
    queryFn:()=>getProfitLoss(year),
    select:(data)=>{
        const monthlyReport=data.monthly_totals;
        return monthlyReport.map((item)=>{
            const totalIncome = item.net_income + (item.expenses || 0); 
            const profit=(item.profit/item.net_income)*100;
            return {
                name: item.month || "N/A",
                totalIncome: totalIncome || 0,
                expenses: item.expenses || 0,
                netIncome: item.net_income || 0,
                profitPercentage: profit || 0, 
            }
        })
    }
})