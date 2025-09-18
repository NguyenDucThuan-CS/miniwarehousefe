"use client"

import { Check, ChevronsUpDown, X } from "lucide-react"
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useFormContext } from "react-hook-form"
import { useState } from "react"
import { ID_DEFAULT } from "@/lib/constants"


export function ComboboxForm({
    label, 
    options, 
    name,
    isRequired,
    disabled
}: {
    label?: string, 
    options: {label: string, value: string}[], 
    name: string,
    isRequired?: boolean,
    disabled?: boolean
}) {
  const {control, setValue} = useFormContext()
  const [open, setOpen] = useState(false)
  
  return (
    <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col">
        {label && <FormLabel>{label} {isRequired && <span className="text-red-500">*</span>}</FormLabel>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  !field.value && "text-muted-foreground",
                  disabled && "bg-[#dddddd] border-[#dddddd]"
                )}
                disabled={disabled}
              >
                                 {field.value
                   ? options.find(
                       (option) => option.value === field.value
                     )?.label || ""
                   : ""}
                 <ChevronsUpDown className="opacity-50 ml-auto" />
              </Button>
            </FormControl>
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
                  {options.map((option) => (
                                                               <CommandItem
                        value={option.label}
                        key={option.value}
                        onSelect={() => {
                          setValue(name, option.value)
                          setOpen(false)
                        }}
                        className="group relative"
                      >
                        {option.label}
                        <div className="flex items-center gap-1 ml-auto">
                          <Check
                            className={cn(
                              "ml-auto",
                              option.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </div>
                        {option.value === field.value && field.value !== ID_DEFAULT && (
                          <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity bg-white rounded-sm flex items-center justify-center"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log("clickzzzz")
                              setValue(name, ID_DEFAULT)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </FormItem>
    )}
  />
  )
}
