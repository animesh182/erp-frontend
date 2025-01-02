import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';


export default function ComboboxProjects({ projectNames, onSelectProject,prop }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(prop||"");
    // Remove duplicate names
    const uniqueprojectNames = [...new Set(projectNames)];
  
    const handleSelect = (currentValue) => {
      const selectedValue = currentValue === value ? "" : currentValue;
      setValue(selectedValue);
      setOpen(false);
  
      // Call the callback to notify the parent of the selected value
      if (onSelectProject) {
        onSelectProject(selectedValue);
      }
    };

    const truncate = (text, length) => 
      text.length > length ? text.substring(0, length) + "..." : text;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="md:w-[250px] lg:w-[250px] w-32 justify-between"
          >
            {/* {value ? uniqueprojectNames.find((name) => name === value)?.substring(0, 25) :prop?prop: "Select project"} */}

          {
            value 
              ? truncate(uniqueprojectNames.find((name) => name === value) || "", 25) 
              : prop  
              ? truncate(prop, 25) 
              : "Select project"
          }
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search project..." />
            <CommandList>
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup>
                {uniqueprojectNames.map((name) => (
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



