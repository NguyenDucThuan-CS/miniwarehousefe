"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export function Combobox({ 
    options, 
    disabled,
    value,
    onChange,
    onClick
}: {
    options: {label: string, value: string, isHighlight?: boolean, prefix?: React.ReactNode}[], 
    disabled?: boolean,
    value?: string,
    onChange?: (value: string) => void,
    onClick?: () => void
}) {
  return (
    <>
        <Popover>
          <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-[200px] justify-between w-full h-full",
                  !value && "text-muted-foreground",
                  disabled && "bg-[#dddddd] border-[#dddddd]"
                )}
                disabled={disabled}
                onClick={onClick}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="truncate flex-1 text-left" style={{ cursor: "pointer" }}>
                      {value
                        ? 
                        <div className="flex items-center gap-1">
                          {options?.find(
                              (option) => option.value === value
                            )?.prefix}
                          {options?.find(
                              (option) => option.value === value
                            )?.label || ""}
                        </div>
                        : ""}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      {value
                        ? options?.find(
                            (option) => option.value === value
                          )?.label || ""
                        : ""}
                    </span>
                  </TooltipContent>
                </Tooltip>
                <ChevronsUpDown className="opacity-50 ml-2 flex-shrink-0" />
              </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                placeholder="Search..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No item found.</CommandEmpty>
                <CommandGroup>
                  {options?.map((option) => (
                    <CommandItem
                      value={option.label}
                      key={option.value}
                      onSelect={() => {
                        onChange?.(option.value)
                      }}
                      className={cn(
                        option.isHighlight && "font-bold"
                      )}
                    >
                      {option.prefix && option.prefix}
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          option.value === value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
    </>
  )
}
