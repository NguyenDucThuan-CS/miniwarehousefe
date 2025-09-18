'use client';

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusCircle } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

interface MultipleSelectProps {
  label?: string;
  options: { value: string; label: string }[];
  name: string;
  disabled?: boolean;
}

export function MultipleSelect({ label, options, name, disabled }: MultipleSelectProps) {
  const { setValue, getValues } = useFormContext();
  const [chosenOptions, setChosenOptions] = useState<string[]>(getValues(name) || []);

  const handleSelect = (value: string) => {
    const currentValues = getValues(name) || [];
    let updatedValues: string[];

    if (currentValues.includes(value)) {
      updatedValues = currentValues.filter((v: string) => v !== value);
    } else {
      updatedValues = [...currentValues, value];
    }

    setChosenOptions(updatedValues);
    setValue(name, updatedValues, { shouldValidate: true });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2" disabled={disabled}>
          <PlusCircle className="h-4 w-4" />
          {label ? label : ''} {chosenOptions.length > 0 ? `(${chosenOptions.length})` : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command>
          <CommandInput placeholder={label} className="h-9" />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div className="flex items-center space-x-3 py-1">
                    <Checkbox
                      id={option.value}
                      checked={chosenOptions.includes(option.value)}
                      onCheckedChange={() => handleSelect(option.value)}
                    />
                    <label
                      htmlFor={option.value}
                      className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}