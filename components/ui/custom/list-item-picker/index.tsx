"use client"

import { useEffect, useState } from "react"
import { Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import TriggerModal from "@/components/ui/custom/trigger-modal"

export interface ListItem {
  id: string;
  item: string;
}

interface ListItemPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  title?: string;
  items?: ListItem[];
  isLoading?: boolean;
}

export function ListItemPicker({ 
  value, 
  onChange, 
  placeholder = "Search Item...", 
  disabled = false,
  multiple = false,
  title = "Select Item",
  items = [],
}: ListItemPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ListItem[]>([]);
  const [valueInput, setValueInput] = useState(value);
  
  const filteredItems = items.filter(item => 
    item.item.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    setValueInput(value);
  }, [value]);

  // Function to select rows based on current value
  const selectRowsByValue = () => {
    if (valueInput) {
      // Parse selected values from input
      const selectedValues = valueInput.split(',').map(v => v.trim());
      
      // Select items that match current value
      const currentSelected = items.filter(item => 
        selectedValues.includes(item.item)
      );
      setSelectedItems(currentSelected);
    }
  };

  // Select rows when modal opens
  useEffect(() => {
    if (isModalOpen) {
      selectRowsByValue();
    }
  }, [isModalOpen, valueInput, items]);

  const handleItemClick = (item: ListItem) => {
    if (multiple) {
      const isSelected = selectedItems.some(selected => selected.id === item.id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      setSelectedItems([item]);
    }
  };

  const handleConfirm = () => {
    const selectedValues = selectedItems.map(item => item.item).join(', ');
    setValueInput(selectedValues);
    onChange(selectedValues);
    setIsModalOpen(false);
  };

      return (
      <TriggerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={title}
        confirmText="Select"
        handleConfirm={handleConfirm}
        isDisabled={disabled}
        disableTrigger={disabled}
        triggetpart={
        <div className="relative w-full h-full">
          <Input
            value={valueInput}
            placeholder={placeholder}
            disabled={disabled}
            className="pr-10 h-full"
            readOnly
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Search Item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="h-[300px] border rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b px-4 py-2 font-medium text-sm">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-1 text-center">No.</div>
              <div className="col-span-11">Item</div>
            </div>
          </div>
          <div className="max-h-[250px] overflow-y-auto">
            {filteredItems.map((item, index) => {
              const isSelected = selectedItems.some(selected => selected.id === item.id);
              return (
                <div
                  key={item.id}
                  className={cn(
                    "px-4 py-2 cursor-pointer hover:bg-gray-50 border-b last:border-b-0",
                    isSelected && "bg-blue-50"
                  )}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 text-center font-medium">
                      {index + 1}
                    </div>
                    <div className="col-span-11 flex items-center justify-between">
                      <span className="text-sm">{item.item}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TriggerModal>
  );
}
