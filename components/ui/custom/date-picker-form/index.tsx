"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Control, useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formateDate } from "@/lib/utils"

export function DatePickerForm({ name, label, isRequired, disabled }: { name: string; label?: string; isRequired?: boolean; disabled?: boolean }) {
  const { control } = useFormContext();
  return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              {label && <FormLabel>{label} {isRequired && <span className="text-red-500">*</span>}</FormLabel>}
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={disabled}
                    >
                      {field.value ? (
                        formateDate(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
  )
}
