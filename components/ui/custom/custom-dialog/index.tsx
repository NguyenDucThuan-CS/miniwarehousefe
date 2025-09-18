import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/ui/custom/table-skeleton";
import { ListButton, ButtonItem } from "@/components/ui/custom/list-button";

interface OrderListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  isLoading: boolean;
  children: React.ReactNode;
  footerButtons?: ButtonItem[];
  footerFlexDirection?: 'row' | 'column';
  footerGap?: 'sm' | 'md' | 'lg';
  extraFooterInfo?: React.ReactNode;
}

export default function CustomDialog({
  open,
  onOpenChange,
  title = "Order List",
  isLoading,
  children,
  footerButtons = [],
  footerFlexDirection = 'row',
  footerGap = 'md',
  extraFooterInfo = ''
}: OrderListDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="overflow-y-auto pt-10 flex flex-col justify-left"
        style={{
          width: '95vw',
          maxWidth: '95vw',
          maxHeight: '95vh',
          height: '95vh'
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <TableSkeleton columns={10} rows={10} />
        ) : (
          children
        )}
        <DialogFooter>
        {extraFooterInfo ? <div className="flex flex-row justify-between gap-2 w-full">
          {extraFooterInfo}
          {footerButtons.length > 0 && (
            <ListButton
              items={footerButtons}
              flexDirection={footerFlexDirection}
                gap={footerGap}
              />
            )}
          </div> : footerButtons.length > 0 && (
            <ListButton
              items={footerButtons}
              flexDirection={footerFlexDirection}
                gap={footerGap}
              />
            )}
        </DialogFooter> 
      </DialogContent>
    </Dialog>
  );
} 