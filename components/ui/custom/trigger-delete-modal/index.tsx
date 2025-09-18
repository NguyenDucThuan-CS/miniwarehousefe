"use client";
import TriggerModal from "../trigger-modal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { FormItem } from "../custom-form";

interface TriggerDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleConfirm: () => void;
  isDisabled: boolean;
  title?: string;
  items?: FormItem[];
  confirmText: string;
  extraComponent?: React.ReactNode;
  isShowTrigger?: boolean;
}

export default function TriggerDeleteModal({ 
    open, 
    onOpenChange, 
    handleConfirm, 
    isDisabled, 
    confirmText,
    isShowTrigger = true,
}: TriggerDeleteModalProps) {
  const triggerpart = (
    isShowTrigger && <Button variant="destructive" className="cursor-pointer" disabled={isDisabled} size="sm">
      <Trash2 className="w-2 h-2" />
    </Button>
  )
  return (
    <TriggerModal
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      isDisabled={isDisabled}
      title={'Delete Modal'}
      triggetpart={triggerpart}
      confirmText={confirmText}
    >
      <div className="text-center py-4">
        <p className="text-gray-600">Are you sure to delete?</p>
      </div>
    </TriggerModal>
  );
}