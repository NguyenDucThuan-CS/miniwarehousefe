"use client"

import { useForm } from "react-hook-form"
import { FormProvider } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ColorPickerForm } from "./index"

interface FormData {
  primaryColor: string
  accentColor: string
  backgroundColor: string
}

export function ColorPickerExample() {
  const methods = useForm<FormData>({
    defaultValues: {
      primaryColor: "#3B82F6",
      accentColor: "#10B981",
      backgroundColor: "#FFFFFF"
    }
  })

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data)
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Color Picker Example</h2>
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <ColorPickerForm
            name="primaryColor"
            label="Primary Color"
            isRequired
          />
          
          <ColorPickerForm
            name="accentColor"
            label="Accent Color"
            isRequired
          />
          
          <ColorPickerForm
            name="backgroundColor"
            label="Background Color"
          />
          
          <Button type="submit" className="w-full">
            Submit Colors
          </Button>
        </form>
      </FormProvider>
      
      <div className="mt-6 p-4 border rounded-lg">
        <h3 className="font-semibold mb-2">Selected Colors:</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: methods.watch("primaryColor") }}
            />
            <span>Primary: {methods.watch("primaryColor")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: methods.watch("accentColor") }}
            />
            <span>Accent: {methods.watch("accentColor")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded border"
              style={{ backgroundColor: methods.watch("backgroundColor") }}
            />
            <span>Background: {methods.watch("backgroundColor")}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 