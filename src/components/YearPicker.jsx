    "use client";

    import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useEffect } from "react";

    export default function YearPicker({ 
    initialYear = new Date().getFullYear(), 
    selectedYear, 
    onYearSelect, 
    }) {

        const minYear=2010
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - minYear + 1 }, (_, index) => minYear + index);

    useEffect(() => {
        if (!selectedYear) {
        onYearSelect(initialYear);
        }
    }, [initialYear, selectedYear, onYearSelect]);

    return (
        <Select
        value={selectedYear}
        onValueChange={(year) => onYearSelect(year)}
        aria-label="Select Year"
        >
        <SelectTrigger className="w-[150px]">
            {selectedYear || "Select Year"}
        </SelectTrigger>
        <SelectContent>
            {years.map((year) => (
            <SelectItem key={year} value={year}>
                {year}
            </SelectItem>
            ))}
        </SelectContent>
        </Select>
    );
    }
