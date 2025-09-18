"use client"

import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formateDate } from "@/lib/utils"
import dayjs from "dayjs"

export function DatePicker({ value, onChange, disabled, borderColor }: { value: Date | null; onChange: (date: Date) => void; disabled?: boolean, borderColor?: string }) {
  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button
            variant={"outline"}
            className={cn(
                "pl-3 text-left font-normal w-full h-full",
                !value && "text-muted-foreground"
            )}
            disabled={disabled}
            style={{ borderColor: borderColor }}
            >
            {value && formateDate(dayjs(value).format('YYYY-MM-DD'))}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
        <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={onChange}
            required
        />
        </PopoverContent>
  </Popover>
  )
}
