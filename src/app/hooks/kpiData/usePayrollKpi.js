    import { getPayrollKpi } from '@/app/api/finances/payroll/getPayrollKpi';
    import { useQuery } from '@tanstack/react-query';
    import { DollarSign, CreditCard } from 'lucide-react';
    import { format } from 'date-fns';
import { toast } from 'sonner';

    export const usePayrollKpi = () => {
    return useQuery({
        queryKey: ["payrollKpi"],
        queryFn: async () => {
        const response = await getPayrollKpi();
        if (response.status === 200) {
            return response.data;
        } else {
            console.error(`Error: Received status ${response.status}`);
            throw new Error(`Failed to fetch payroll KPI data: ${response.message || "Unknown error"}`);
        }
        },
        select: (data) => {
        const { total_outstanding, upcoming_payroll, previous_payroll } = data;

        return [
            {
            title: "Total Outstanding",
            value: total_outstanding,
            subtitle: "Total outstanding invoices",
            icon: <DollarSign className="h-4 w-4" />,
            isMoney: true,
            },
            {
            title: "Upcoming Payroll",
            value: upcoming_payroll.total_amount
                ?upcoming_payroll.total_amount
                : "No Upcoming Payroll",
            subtitle: "Next payroll due",
            icon: <CreditCard className="h-4 w-4" />,
            isMoney: true,
            date:upcoming_payroll.earliest_date
            ? `Earliest Date: ${format(new Date(upcoming_payroll.earliest_date), "MMM d, yyyy")}`
            : "No Upcoming Date",
            },
            {
            title: "Previous Payroll",
            value: previous_payroll.total_amount
                ? previous_payroll.total_amount
                : "No Previous Payroll",
            subtitle: previous_payroll.most_recent_date
                ? `Paid on ${format(
                    new Date(previous_payroll.most_recent_date),
                    "MMM d, yyyy"
                )}`
                : "No Previous Date",
            icon: <DollarSign className="h-4 w-4" />,
            isMoney: true,
            date: previous_payroll.most_recent_date
            ? `Paid on ${format(
                new Date(previous_payroll.most_recent_date),
                "MMM d, yyyy"
            )}`
            : "No Previous Date",
            },
        ];
        },
        onSuccess: () => {
        toast.success("KPI data fetched successfully");
        },
        onError: (error) => {
        toast.error("Failed to fetch KPI data");
        console.error("Error fetching KPI data:", error);
        },
    });
    };
