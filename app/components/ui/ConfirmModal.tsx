import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  itemCount?: number;
}

export default function ConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  itemCount,
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-400">
            {description}
          </DialogDescription>
          {itemCount !== undefined && (
            <p className="text-sm text-zinc-500 mt-2">
              This will remove {itemCount} item{itemCount !== 1 ? "s" : ""} from your watchlist.
            </p>
          )}
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2 mt-6">
          <Button
            variant="secondary"
            className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white border-red-500"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
