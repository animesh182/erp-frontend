import { fetchPayroll } from '@/app/api/finances/payroll/getPayroll';
import { useQuery } from '@tanstack/react-query';

    export const usePayroll = (startDate, endDate) => {
    return useQuery({
        queryKey: ["payroll", { startDate, endDate }],
        queryFn: async () => {
            return await fetchPayroll(startDate, endDate);

        },
        enabled: !!startDate && !!endDate,
        select: (data) => {
        // Transform the data here
        return data.map((item) => ({
            id: item.id,
            name: item.name,
            projectName: null,
            invoice: `#${item.id}`,
            invoiceIssuedDate: item.invoice_issued_date,
            paidDate: item.payment_date,
            status: item.payment_status.toLowerCase(),
            type: item.type.toLowerCase(),
            amount: parseFloat(item.amount),
        }));
            },
            onSuccess: () => {
                toast.success("Data fetched successfully");
            },
            onError: (error) => {
                toast.error("Failed to fetch data");
                console.error("Error fetching data:", error);
            },
        });
    };

