"use client";
import TriggerModal from "../trigger-modal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CustomForm, FormItem } from "../custom-form";

interface TriggerEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleConfirm: () => void;
  isDisabled: boolean;
  title: string;
  items: FormItem[];
  confirmText: string;
  extraComponent?: React.ReactNode;
  disableTrigger?: boolean;
  topExtraComponent?: React.ReactNode;
}

export default function TriggerEditModal({ 
    open, 
    onOpenChange, 
    handleConfirm, 
    isDisabled, 
    title,
    items,
    confirmText,
    extraComponent,
    disableTrigger,
    topExtraComponent
}: TriggerEditModalProps) {
  const triggerpart = (
    <Button variant="outline" className="cursor-pointer">
      <PlusCircle />
      Add
    </Button>
  )
  return (
    <TriggerModal
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      isDisabled={isDisabled}
      title={title}
      triggetpart={triggerpart}
      confirmText={confirmText}
      disableTrigger={disableTrigger}
    >
      {topExtraComponent}
      <CustomForm items={items} />
      {extraComponent}
    </TriggerModal>
  );
}