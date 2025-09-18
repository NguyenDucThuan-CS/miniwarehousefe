"use client";

import { useEffect, useState } from "react";
import CustomDialog from "../custom-dialog";
import { ButtonItem } from "../list-button";

interface TriggerCustomDialogProps {
  triggerPart: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  isLoading?: boolean;
  onOpenChange?: (open: boolean) => void;
  footerButtons?: ButtonItem[];
  footerFlexDirection?: 'row' | 'column';
  footerGap?: 'sm' | 'md' | 'lg';
  extraFooterInfo?: React.ReactNode;
  onClickTriggerPart?: () => void;
  open?: boolean;
}

export default function TriggerCustomDialog({
  triggerPart,
  children,
  title = "Dialog",
  isLoading = false,
  onOpenChange,
  footerButtons = [],
  footerFlexDirection = 'row',
  footerGap = 'md',
  onClickTriggerPart,
  open,
  extraFooterInfo
}: TriggerCustomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const handleClickTriggerPart = () => {
    setIsOpen(true);
    onClickTriggerPart?.();
  }

  useEffect(() => {
    setIsOpen(open ?? false);
  }, [open]);

  return (
    <>
      {/* Trigger Part */}
      <div onClick={handleClickTriggerPart}>
        {triggerPart}
      </div>

      {/* Dialog Part */}
      <CustomDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        title={title}
        isLoading={isLoading}
        footerButtons={footerButtons}
        footerFlexDirection={footerFlexDirection}
        footerGap={footerGap}
        extraFooterInfo={extraFooterInfo}
      >
        {children}
      </CustomDialog>
    </>
  );
}