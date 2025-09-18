"use client"

import { useFormContext } from "react-hook-form"

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


export function InputForm({ name, label, isRequired, disabled, inputType = "text", pattern, placeholder }: { name: string; label?: string; isRequired?: boolean; disabled?: boolean, inputType?: string, pattern?: string, placeholder?: string }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
            <FormItem>
              {label && <FormLabel>{label} {isRequired && <span className="text-red-500">*</span>}</FormLabel>}
              <FormControl>
                <Input {...field} disabled={disabled} type={inputType} pattern={pattern} placeholder={placeholder}/>
              </FormControl>
            </FormItem>
          )}
        />
  )
}
