"use client";
import TriggerModal from "../trigger-modal";
import { Pencil } from "lucide-react";
import { CustomForm, FormItem } from "../custom-form";

interface TriggerAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleConfirm: () => void;
  isDisabled: boolean;
  title: string;
  items: FormItem[];
  confirmText: string;
  extraComponent?: React.ReactNode;
}

export default function TriggerAddModal({ 
    open, 
    onOpenChange, 
    handleConfirm, 
    isDisabled, 
    title,
    items,
    confirmText,
    extraComponent,
}: TriggerAddModalProps) {
  return (
    <TriggerModal
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      isDisabled={isDisabled}
      title={title}
      triggetpart={<Pencil className="w-4 h-4 text-gray-400 cursor-pointer" />}
      confirmText={confirmText}
    >
      <CustomForm items={items} />
      {extraComponent}
    </TriggerModal>
  );
}