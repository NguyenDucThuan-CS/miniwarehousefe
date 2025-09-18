"use client";
import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

interface TriggerModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  handleConfirm: () => void;
  isDisabled: boolean;
  title: string;
  triggetpart?: React.ReactNode;
  confirmText: string;
  handleCancel?: () => void;
  disableTrigger?: boolean;
}

export default function TriggerModal({ 
  open: controlledOpen, 
  onOpenChange, 
  children, 
  handleConfirm, 
  isDisabled, 
  title, 
  triggetpart, 
  confirmText, 
  handleCancel: handleCancelProp,
  disableTrigger
}: TriggerModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use controlled open state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(open);
    }
    onOpenChange?.(open);
  };

  const handleCancel = () => {
    if(handleCancelProp) {
      handleCancelProp();
    }
    setInternalOpen(false);
    onOpenChange?.(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {triggetpart && (
        <DialogTrigger asChild>
          {triggetpart}
        </DialogTrigger>
      )}
      {!disableTrigger && <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[500px] overflow-y-auto px-2">
          {children}
        </div>
        <DialogFooter>
          <Button onClick={handleCancel} variant="outline">Cancel</Button>
          <Button onClick={handleConfirm} disabled={isDisabled}>{confirmText}</Button>
        </DialogFooter> 
      </DialogContent>}
    </Dialog>
  );
}
