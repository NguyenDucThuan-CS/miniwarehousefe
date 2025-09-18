"use client";
import TriggerModal from "../trigger-modal";


interface TriggerTextModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleConfirm: () => void;
  isDisabled: boolean;
  title: string;
  confirmText: string;
  children: React.ReactNode;
  text: string;
}

export default function TriggerTextModal({ 
    open, 
    onOpenChange, 
    handleConfirm, 
    isDisabled, 
    title,
    confirmText,
    children,
    text
}: TriggerTextModalProps) {
  const triggerpart = (
    <span>
      {text}
    </span>
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
    >
      {children}
    </TriggerModal>
  );
}