
import { fetchProfitLoss } from "@/app/api/dashboard/fetchProfitLoss";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

    const monthAbbreviations = {
    January: "Jan",
    February: "Feb",
    March: "Mar",
    April: "Apr",
    May: "May",
    June: "Jun",
    July: "Jul",
    August: "Aug",
    September: "Sep",
    October: "Oct",
    November: "Nov",
    December: "Dec",
    };

    export const useProfitLoss = (selectedProject, startYear) => {
        const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["profitLoss", { selectedProject,startYear }],
        queryFn: async () => {
        const response = await fetchProfitLoss(selectedProject, startYear);
        if (response.status === 200 && Array.isArray(response.data.monthly_totals)) {
            return response.data.monthly_totals; // Return raw data
        } else {
            throw new Error("Failed to fetch profit-loss data");
        }
        },
        select: (rawData) => {
        // Transform raw data here
        
        if (!rawData || rawData.length === 0) {
            return Object.values(monthAbbreviations).map((month) => ({
            name: month,
            totalIncome: 0,
            expenses: 0,
            profit: 0,
            profitPercentage: 0,
            }));
            
        }
        

        return rawData.map((monthData) => {
            const { month, net_income, expenses, profit } = monthData;
            const profitPercentage = net_income > 0 ? (profit / net_income) * 100 : 0;
            return {
            name: monthAbbreviations[month], // Abbreviated month name
            totalIncome: net_income,
            expenses,
            profit,
            profitPercentage,
            };
        });
        },
        onError: (error) => {
        console.error(error.message);
        toast.error("Failed to fetch profit-loss data");
        },
        // keepPreviousData: true,
        // placeholderData: (previousData) => {
        //     // Return previous data of this specific query if available
        //     const currentData = queryClient.getQueryData(["profitLoss", { selectedProject, startYear }]);
        //     return currentData || previousData || [];
        //     },
            keepPreviousData: true,
            });
        };
