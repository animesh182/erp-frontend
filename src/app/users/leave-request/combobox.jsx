

"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// export default function ComboboxEmployees({ employeeNames }) {
//   const [open, setOpen] = useState(false);
//   const [value, setValue] = useState("");

//   // Remove duplicate names
//   const uniqueEmployeeNames = [...new Set(employeeNames)];

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-[200px] justify-between"
//         >
//           {value ? uniqueEmployeeNames.find((name) => name === value) : "Select employee"}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[200px] p-0">
//         <Command>
//           <CommandInput placeholder="Search employee..." />
//           <CommandList>
//             <CommandEmpty>No employee found.</CommandEmpty>
//             <CommandGroup>
//               {uniqueEmployeeNames.map((name) => (
//                 <CommandItem
//                   key={name}
//                   value={name}
//                   onSelect={(currentValue) => {
//                     setValue(currentValue === value ? "" : currentValue);
//                     setOpen(false);
//                   }}
//                 >
//                   <Check
//                     className={cn(
//                       "mr-2 h-4 w-4",
//                       value === name ? "opacity-100" : "opacity-0"
//                     )}
//                   />
//                   {name}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }


export default function ComboboxEmployees({ employeeNames, onSelectEmployee }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // Remove duplicate names
  const uniqueEmployeeNames = [...new Set(employeeNames)];

  const handleSelect = (currentValue) => {
    const selectedValue = currentValue === value ? "" : currentValue;
    setValue(selectedValue);
    setOpen(false);

    // Call the callback to notify the parent of the selected value
    if (onSelectEmployee) {
      onSelectEmployee(selectedValue);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? uniqueEmployeeNames.find((name) => name === value) : "Select employee"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search employee..." />
          <CommandList>
            <CommandEmpty>No employee found.</CommandEmpty>
            <CommandGroup>
              {uniqueEmployeeNames.map((name) => (
                <CommandItem
                  key={name}
                  value={name}
                  onSelect={handleSelect} // Use handleSelect here
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}