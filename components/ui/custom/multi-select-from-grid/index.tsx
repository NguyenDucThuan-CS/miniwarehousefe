"use client"

import { useEffect, useState } from "react"
import { Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import TriggerModal from "@/components/ui/custom/trigger-modal"

export interface GridItem {
  id: string;
  name: string;
  description: string;
}

interface MultiSelectFromGridProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  title?: string;
  items?: GridItem[];
  isLoading?: boolean;
  singleChoice?: boolean; // New prop for single choice mode
}

export function MultiSelectFromGrid({ 
  value, 
  onChange, 
  placeholder = "Select items...", 
  disabled = false,
  title = "Select Items",
  items = [],
  singleChoice = true, // Default to multiple choice
}: MultiSelectFromGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<GridItem[]>([]);
  const [valueInput, setValueInput] = useState(value);
  // Separate state for the input display - only updates on confirm
  const [displayValue, setDisplayValue] = useState(value);
  
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    setValueInput(value);
    setDisplayValue(value);
  }, [value]);

  // Function to get display text for a value
  const getDisplayText = (value: string) => {
    if (!value) return '';
    
    if (singleChoice) {
      const selectedItem = items.find(item => item.id === value);
      return selectedItem ? `${selectedItem.name}-${selectedItem.description}` : '';
    } else {
      const selectedIds = value.split(',').map(v => v.trim());
      const selectedItems = items.filter(item => selectedIds.includes(item.id));
      return selectedItems.map(item => `${item.name}-${item.description}`).join(', ');
    }
  };

  // Function to select rows based on current value (IDs)
  const selectRowsByValue = () => {
    if (valueInput) {
      if (singleChoice) {
        // For single choice, find the item by ID
        const selectedItem = items.find(item => item.id === valueInput);
        if (selectedItem) {
          setSelectedItems([selectedItem]);
        }
      } else {
        // For multiple choice, parse comma-separated IDs
        const selectedIds = valueInput.split(',').map(v => v.trim());
        const currentSelected = items.filter(item => 
          selectedIds.includes(item.id)
        );
        setSelectedItems(currentSelected);
      }
    }
  };



  const handleItemClick = (item: GridItem) => {
    if (singleChoice) {
      // For single choice, replace the selection
      setSelectedItems([item]);
    } else {
      // For multiple choice, toggle selection
      const isSelected = selectedItems.some(selected => selected.id === item.id);
      if (isSelected) {
        setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    }
  };

  const handleConfirm = () => {
    if (singleChoice) {
      // For single choice, return the ID of the selected item
      const selectedValue = selectedItems.length > 0 ? selectedItems[0].id : '';
      setValueInput(selectedValue);
      setDisplayValue(selectedValue);
      onChange(selectedValue);
    } else {
      // For multiple choice, return comma-separated IDs
      const selectedValues = selectedItems.map(item => item.id).join(', ');
      setValueInput(selectedValues);
      setDisplayValue(selectedValues);
      onChange(selectedValues);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full space-y-2">
      <TriggerModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (open) {
            // Initialize selections when modal opens
            selectRowsByValue();
          } else {
            // Reset selections to current display value when modal closes without confirming
            selectRowsByValue();
          }
        }}
        title={title}
        confirmText="Select"
        handleConfirm={handleConfirm}
        isDisabled={false}
        disableTrigger={disabled}
        triggetpart={
          <div className="relative w-full">
            <Input
              value={getDisplayText(displayValue)}
              placeholder={placeholder}
              disabled={disabled}
              className="pr-10"
              readOnly
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        }
      >
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="h-[400px] border rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b px-4 py-2 font-medium text-sm">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-1 text-center">No.</div>
                <div className="col-span-5">Reason</div>
                <div className="col-span-5">Root Cause</div>
                <div className="col-span-1 text-center"></div>
              </div>
            </div>
            <div className="max-h-[350px] overflow-y-auto">
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
                      <div className="col-span-1 text-center font-medium text-sm">
                        {index + 1}
                      </div>
                      <div className="col-span-5 text-sm">{item.name}</div>
                      <div className="col-span-5 text-sm text-gray-600">{item.description}</div>
                      <div className="col-span-1 text-center">
                        {isSelected && (
                          <Check className="h-4 w-4 text-blue-600 mx-auto" />
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
    </div>
  );
}
