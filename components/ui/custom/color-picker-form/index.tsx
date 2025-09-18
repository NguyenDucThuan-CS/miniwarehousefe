"use client"

import { useState } from "react"
import { Palette, Check } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Predefined color palettes
const COLOR_PALETTES = [
  {
    name: "Primary Colors",
    colors: [
      "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", 
      "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080"
    ]
  },
  {
    name: "Pastel Colors",
    colors: [
      "#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA", "#FFB3F7",
      "#B3FFE6", "#F7B3FF", "#E6B3FF", "#B3F7FF", "#FFF7B3"
    ]
  },
  {
    name: "Material Colors",
    colors: [
      "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
      "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50"
    ]
  },
  {
    name: "Neutral Colors",
    colors: [
      "#F5F5F5", "#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575",
      "#616161", "#424242", "#212121", "#000000", "#FFFFFF"
    ]
  }
]

export function ColorPickerForm({ 
  name, 
  label, 
  isRequired, 
  disabled 
}: { 
  name: string; 
  label?: string; 
  isRequired?: boolean; 
  disabled?: boolean 
}) {
  const { control } = useFormContext();
  const [customColor, setCustomColor] = useState("#000000");

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
                    "w-[200px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: field.value || "#000000" }}
                    />
                    {field.value ? (
                      <span className="uppercase">{field.value}</span>
                    ) : (
                      <span>Pick a color</span>
                    )}
                  </div>
                  <Palette className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                {/* Custom Color Input */}
                <div className="space-y-2">
                  <Label htmlFor="custom-color">Custom Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-color"
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        field.onChange(e.target.value);
                      }}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      type="text"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        field.onChange(e.target.value);
                      }}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Color Palettes */}
                {COLOR_PALETTES.map((palette, paletteIndex) => (
                  <div key={paletteIndex} className="space-y-2">
                    <Label className="text-sm font-medium">{palette.name}</Label>
                    <div className="grid grid-cols-10 gap-1">
                      {palette.colors.map((color, colorIndex) => (
                        <button
                          key={colorIndex}
                          type="button"
                          className={cn(
                            "w-8 h-8 rounded border-2 transition-all hover:scale-110 relative",
                            field.value === color && "border-2 border-primary"
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            field.onChange(color);
                            setCustomColor(color);
                          }}
                        >
                          {field.value === color && (
                            <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
