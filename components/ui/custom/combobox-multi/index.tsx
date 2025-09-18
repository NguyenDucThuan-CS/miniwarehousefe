'use client';

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

interface MultipleComboboxProps {
  label: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  setValue: (value: string[]) => void;
  values: string[];
  onClick?: () => void;
}

export function MultipleCombobox({ label, options, disabled, setValue, values, onClick }: MultipleComboboxProps) {
  const [chosenOptions, setChosenOptions] = useState<string[]>(values || []);
  const [displayText, setDisplayText] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleSelect = (value: string) => {
    const currentValues = values || [];
    let updatedValues: string[];

    if (currentValues.includes(value)) {
      updatedValues = currentValues.filter((v: string) => v !== value);
    } else {
      updatedValues = [...currentValues, value];
    }

    setChosenOptions(updatedValues);
    setValue(updatedValues);
  };

  // Function to get selected option labels
  const getSelectedLabels = () => {
    return options
      .filter(option => chosenOptions.includes(option.value))
      .map(option => option.label);
  };

  // Function to update display text with ellipsis
  const updateDisplayText = () => {
    const selectedLabels = getSelectedLabels();
    
    if (selectedLabels.length === 0) {
      setDisplayText(label);
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

  // Update display text when chosenOptions changes
  useEffect(() => {
    updateDisplayText();
  }, [chosenOptions, options]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          ref={buttonRef}
          variant="outline" 
          className={cn("flex items-center gap-2 justify-between h-full w-full", disabled && "bg-[#dddddd] border-[#dddddd]")} 
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

export { MultipleComboboxForm } from './multiple-combobox-form';