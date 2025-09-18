"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
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
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

interface MultipleComboboxFormProps {
  label?: string;
  options: { value: string; label: string }[];
  name: string;
  disabled?: boolean;
  isRequired?: boolean;
  onClick?: () => void;
}

export function MultipleComboboxForm({ 
  label, 
  options, 
  name, 
  disabled, 
  isRequired,
  onClick 
}: MultipleComboboxFormProps) {
  const { control, setValue, watch } = useFormContext();
  const [displayText, setDisplayText] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  // Watch the current value from the form
  const currentValues = watch(name) || [];

  const handleSelect = (value: string) => {
    let updatedValues: string[];

    if (currentValues.includes(value)) {
      updatedValues = currentValues.filter((v: string) => v !== value);
    } else {
      updatedValues = [...currentValues, value];
    }

    setValue(name, updatedValues);
  };

  // Function to get selected option labels
  const getSelectedLabels = () => {
    return options
      .filter(option => currentValues.includes(option.value))
      .map(option => option.label);
  };

  // Function to update display text with ellipsis
  const updateDisplayText = () => {
    const selectedLabels = getSelectedLabels();
    
    if (selectedLabels.length === 0) {
      setDisplayText(label || '');
      return;
    }

    if (selectedLabels.length === 1) {
      setDisplayText(selectedLabels[0]);
      return;
    }

    // Try to show multiple items with ellipsis
    let text = selectedLabels.join(", ");
    if (text.length > 30) { // Adjust this threshold as needed
      const firstItem = selectedLabels[0];
      const remainingCount = selectedLabels.length - 1;
      text = `${firstItem} +${remainingCount} more`;
    }

    setDisplayText(text);
  };

  // Update display text when currentValues changes
  useEffect(() => {
    updateDisplayText();
  }, [currentValues, options]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {label && <FormLabel>
            {label} {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>}
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  ref={buttonRef}
                  variant="outline" 
                  className={cn(
                    "flex items-center gap-2 justify-between h-full w-full", 
                    disabled && "bg-[#dddddd] border-[#dddddd]",
                    !currentValues.length && "text-muted-foreground"
                  )} 
                  disabled={disabled}
                  onClick={onClick}
                >
                  <span 
                    ref={textRef}
                    className="truncate text-left flex-1"
                    title={getSelectedLabels().join(", ")}
                  >
                    {displayText}
                  </span>
                  <div className="flex items-center gap-1">
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </div>
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
                              checked={currentValues.includes(option.value)}
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
          </FormControl>
        </FormItem>
      )}
    />
  );
} 