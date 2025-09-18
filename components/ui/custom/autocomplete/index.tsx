"use client";

import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface Option {
  value: string;
  label: string;
}

interface AutoCompleteProps {
  options: Option[];
  placeholder?: string;
  emptyMessage?: string;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
  maxSelections?: number;
}

export function AutoComplete({
  options,
  placeholder = "Type to search...",
  emptyMessage = "No results found.",
  value = [],
  onValueChange,
  isLoading = false,
  disabled = false,
  maxSelections,
}: AutoCompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      // Remove if already selected
      const newValues = value.filter((val) => val !== selectedValue);
      onValueChange?.(newValues);
    } else if (!maxSelections || value.length < maxSelections) {
      // Add if not at max selections
      const newValues = [...value, selectedValue];
      onValueChange?.(newValues);
    }
    setInputValue(""); // Clear input after selection
  };

  const handleClear = () => {
    onValueChange?.([]);
    setInputValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 max-w-[240px] overflow-hidden">
            {value.length > 0 ? (
              value.map((val) => {
                const option = options.find((opt) => opt.value === val);
                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="mr-1"
                  >
                    {option?.label || val}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(val);
                      }}
                    />
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {value.length > 0 && (
              <X
                className="h-4 w-4 cursor-pointer opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
            disabled={disabled}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      disabled={Boolean(
                        maxSelections &&
                        value.length >= maxSelections &&
                        !value.includes(option.value)
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}