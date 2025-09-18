"use client"

import { useFormContext } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export function CheckboxForm({ 
  name, 
  label,
  description,
  isRequired,
  disabled
}: { 
  name: string; 
  label?: string;
  description?: string;
  isRequired?: boolean;
  disabled?: boolean;
}) {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center gap-2">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label} {isRequired && <span className="text-red-500">*</span>}</FormLabel>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
