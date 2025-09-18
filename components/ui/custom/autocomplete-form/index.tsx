"use client";

import * as React from "react";
import { Control } from "react-hook-form";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  value: string;
  label: string;
}

interface AutoCompleteFormProps {
  control: Control<any>;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  disabled?: boolean;
  maxSelections?: number;
}

export function AutoCompleteForm({
  control,
  name,
  label,
  options,
  placeholder = "Type to search...",
  emptyMessage = "No results found.",
  isLoading = false,
  disabled = false,
  maxSelections,
}: AutoCompleteFormProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[300px] justify-between",
                    !field.value?.length && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  <div className="flex flex-wrap gap-1 max-w-[240px] overflow-hidden">
                    {field.value?.length > 0 ? (
                      field.value.map((val: string) => {
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
                                const newValues = field.value.filter(
                                  (v: string) => v !== val
                                );
                                field.onChange(newValues);
                              }}
                            />
                          </Badge>
                        );
                      })
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {field.value?.length > 0 && (
                      <X
                        className="h-4 w-4 cursor-pointer opacity-50 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange([]);
                        }}
                      />
                    )}
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                  </div>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder={placeholder}
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
                            onSelect={() => {
                              if (field.value.includes(option.value)) {
                                const newValues = field.value.filter(
                                  (val: string) => val !== option.value
                                );
                                field.onChange(newValues);
                              } else if (
                                !maxSelections ||
                                field.value.length < maxSelections
                              ) {
                                const newValues = [
                                  ...field.value,
                                  option.value,
                                ];
                                field.onChange(newValues);
                              }
                            }}
                            disabled={
                              Boolean(
                                maxSelections &&
                                field.value.length >= maxSelections &&
                                !field.value.includes(option.value)
                              )
                            }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value.includes(option.value)
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
}