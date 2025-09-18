"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import TriggerCustomDialog from "../trigger-custom-dialog";
import TriggerModal from "../trigger-modal";

export interface ButtonItem {
  type: 'normal' | 'trigger-dialog' | 'trigger-modal';
  label: string;
  variant?: 'outline' | 'default' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  // For trigger buttons
  title?: string;
  children?: ReactNode;
  isLoading?: boolean;
  onOpenChange?: (open: boolean) => void;
  // For trigger modal specific props
  handleConfirm?: () => void;
  isDisabled?: boolean;
  confirmText?: string;
}

interface ListButtonProps {
  items: ButtonItem[];
  flexDirection?: 'row' | 'column';
  gap?: 'sm' | 'md' | 'lg';
}

export function ListButton({ items, flexDirection = 'row', gap = 'md' }: ListButtonProps) {
  const getGapClass = () => {
    switch (gap) {
      case 'sm': return 'gap-2';
      case 'lg': return 'gap-4';
      default: return 'gap-3';
    }
  };

  return (
    <div className={`flex ${flexDirection === 'row' ? 'flex-row' : 'flex-col'} ${getGapClass()}`}>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`}>
          {(() => {
            switch (item.type) {
              case 'normal':
                return (
                  <Button
                    variant={item.variant || 'default'}
                    size={item.size || 'default'}
                    disabled={item.disabled}
                    onClick={item.onClick}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    {item.label}
                  </Button>
                );

              case 'trigger-dialog':
                return (
                  <TriggerCustomDialog
                    triggerPart={
                      <Button
                        variant={item.variant || 'default'}
                        size={item.size || 'default'}
                        disabled={item.disabled}
                        onClick={item.onClick}
                        className="cursor-pointer"
                      >
                        {item.icon && <span>{item.icon}</span>}
                        {item.label}
                      </Button>
                    }
                    title={item.title || 'Dialog'}
                    isLoading={item.isLoading || false}
                    onOpenChange={item.onOpenChange}
                  >
                    {item.children}
                  </TriggerCustomDialog>
                );

              case 'trigger-modal':
                return (
                  <TriggerModal
                    onOpenChange={item.onOpenChange}
                    handleConfirm={item.handleConfirm || (() => {})}
                    isDisabled={item.isDisabled || false}
                    title={item.title || 'Modal'}
                    confirmText={item.confirmText || 'Confirm'}
                    triggetpart={
                      <Button
                        variant={item.variant || 'default'}
                        size={item.size || 'default'}
                        disabled={item.disabled}
                        className="cursor-pointer"
                      >
                        {item.icon && <span>{item.icon}</span>}
                        {item.label}
                      </Button>
                    }
                  >
                    {item.children}
                  </TriggerModal>
                );

              default:
                return null;
            }
          })()}
        </div>
      ))}
    </div>
  );
}

export default ListButton;