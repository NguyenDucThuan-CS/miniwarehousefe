"use client";
import TriggerModal from "../trigger-modal";
import { CustomForm, FormItem } from "../custom-form";

interface ModalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleConfirm: () => void;
  isDisabled: boolean;
  title: string;
  items: FormItem[];
  confirmText: string;
}

export default function ModalForm({ 
    open, 
    onOpenChange, 
    handleConfirm, 
    isDisabled, 
    title,
    items,
    confirmText,
}: ModalFormProps) {

  return (
    <TriggerModal
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      isDisabled={isDisabled}
      title={title}
      confirmText={confirmText}
    >
      <CustomForm items={items} />
    </TriggerModal>
  );
}