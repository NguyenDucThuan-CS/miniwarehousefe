"use client";

import { InputForm } from "./input-form";
import { DatePickerForm } from "./date-picker-form";
import { MultipleSelect } from "./muilple-select";
import { ComboboxForm } from "./form-combobox";
import { CheckboxForm } from "./form-checkbox";
import { Button } from "@/components/ui/button";
import { ColorPickerForm } from "./color-picker-form";
import { MultipleComboboxForm } from "./combobox-multi";
import { ReactNode } from "react";

export interface FormItem {
  type: 'input' | 'datepicker' | 'mutiselect' | 'combobox' | 'checkbox' | 'button' | 'colorpicker' | 'multiple-combobox';
  name: string;
  label?: string;
  options?: { value: string; label: string }[];
  description?: string;
  isRequired?: boolean;
  disabled?: boolean;
  inputType?: string;
  width?: string;
  pattern?: string;
  onClick?: () => void;
  variant?: 'outline' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link';
  icon?: ReactNode;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  placeholder?: string;
}

interface CustomFormProps {
  items: FormItem[];
  flexDirection?: 'row' | 'column';
}

export function CustomForm({ items, flexDirection = 'column' }: CustomFormProps) {
  return (
    <div className={`flex ${flexDirection === 'row' ? 'flex-row items-end' : 'flex-col'} gap-2 mb-2`}>
      {items.map((item) => (
        <div key={item.name} style={item.width ? { width: item.width } : undefined}>
          {(() => {
            switch (item.type) {
              case 'input':
                return <InputForm placeholder={item.placeholder} name={item.name} label={item.label} isRequired={item.isRequired} disabled={item.disabled} inputType={item.inputType} pattern={item.pattern} />;
              case 'datepicker':
                return <DatePickerForm name={item.name} label={item.label} isRequired={item.isRequired} disabled={item.disabled} />;
              case 'mutiselect':
                return <MultipleSelect name={item.name} label={item.label} options={item.options || []} disabled={item.disabled} />;
              case 'combobox':
                return <ComboboxForm name={item.name} label={item.label} options={item.options || []} isRequired={item.isRequired} disabled={item.disabled} />;
              case 'checkbox':
                return <CheckboxForm name={item.name} label={item.label} description={item.description} isRequired={item.isRequired} disabled={item.disabled} />;
              case 'button':
                return <div className="h-full">
                  <Button onClick={item.onClick} variant={item.variant} size={item.size}>{item.icon}{item.label}</Button>
                </div>;
              case 'colorpicker':
                return <ColorPickerForm name={item.name} label={item.label} isRequired={item.isRequired} disabled={item.disabled} />;
              case 'multiple-combobox':
                return <MultipleComboboxForm name={item.name} label={item.label} options={item.options || []} isRequired={item.isRequired} disabled={item.disabled} />;
              default:
                return null;
            }
          })()}
        </div>
      ))}
    </div>
  );
}
