"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Combobox } from "./combobox";

export interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  label?: string;
  editType?: 'input' | 'combobox' | 'datepicker' | 'mutiselect' | 'checkbox' | 'colorpicker';
  options?: { value: string; label: string }[];
  isRequired?: boolean;
  disabled?: boolean;
  inputType?: string;
  pattern?: string;
  className?: string;
  placeholder?: string;
}

export function EditableText({
  value,
  onSave,
  editType = 'input',
  options = [],
  disabled = false,
  inputType = 'text',
  pattern,
  className = "",
  placeholder
}: EditableTextProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsOpen(false);
  };

  const renderEditControl = () => {
    switch (editType) {
      case 'input':
        return (
          <div className="space-y-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              disabled={disabled}
              type={inputType}
              pattern={pattern}
              placeholder={placeholder}
            />
          </div>
        );
      case 'combobox':
        return (
          <div className="space-y-2">
            <Combobox
              options={options}
              value={editValue}
              onChange={setEditValue}
            />
          </div>
        );
      case 'datepicker':
        return (
          <div className="space-y-2">
            <Input
              type="date"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              disabled={disabled}
            />
          </div>
        );
      case 'mutiselect':
        return (
          <div className="space-y-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              disabled={disabled}
              placeholder="Multiple values separated by comma"
            />
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={editValue === 'true'}
              onChange={(e) => setEditValue(e.target.checked ? 'true' : 'false')}
              disabled={disabled}
            />
          </div>
        );
      case 'colorpicker':
        return (
          <div className="space-y-2">
            <Input
              type="color"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              disabled={disabled}
            />
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="flex-1">
        {editType === 'combobox' 
          ? options.find((option) => option.value === value)?.label || value
          : value || placeholder || 'Click to edit'
        }
      </span>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-gray-100"
            disabled={disabled}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            {renderEditControl()}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 