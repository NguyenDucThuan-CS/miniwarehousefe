import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CustomCombobox({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  onClick,
}: {
  options: { id: string | number; title: string; code: string; desc: string; extraInfo: string }[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between h-8 px-2 text-xs",
            !value && "text-muted-foreground",
            disabled && "bg-[#dddddd] border-[#dddddd]"
          )}
          disabled={disabled}
          onClick={onClick}
        >
          <span className="truncate flex-1 text-left">
            {value
              ? (() => {
                  const option = options.find((option) => option.id === value);
                  return option ? `${option.title} - ${option.code}` : value;
                })()
              : placeholder || "Select..."}
          </span>
          <ChevronsUpDown className="opacity-50 ml-2 flex-shrink-0 w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="pointer-events-auto w-full min-w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-8" />
          <CommandList className="pointer-events-auto max-h-60 overflow-y-auto">
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={`${option.title} ${option.code} ${option.desc}`}
                  key={option.id}
                  onSelect={() => {
                    onChange?.(option.id);
                    setOpen(false);
                  }}
                  className="py-2"
                >
                  <div>
                    <div className="font-semibold text-xs">{option.title}</div>
                    <div className="text-xs">{option.code}</div>
                    <div className="text-xs text-muted-foreground">{option.desc}</div>
                    <div className="text-xs font-semibold">{option.extraInfo}</div>
                  </div>
                  {option.id === value && (
                    <Check className="ml-auto w-4 h-4 text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 