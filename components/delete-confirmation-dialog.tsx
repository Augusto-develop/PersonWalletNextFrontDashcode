import React, { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const DeleteConfirmationDialog = ({
  open, onClose, onConfirm, defaultToast = true, toastMessage = "Successfully deleted",
  title = "Excluir ?",
  description = "Esta ação não pode ser desfeita. Isso excluirá permanentemente seus dados de nossos servidores."
}: {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void>;
  defaultToast?: boolean;
  toastMessage?: string;
  title?: string;
  description?: string;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = async () => {
    if (!onConfirm) {
      onClose();
      return;
    }
    await onConfirm();

    onClose();
    if (defaultToast) {
      toast.success(toastMessage, {
        position: "top-right",
      });
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> {title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={isPending ? "pointer-events-none" : ""}
            onClick={() =>
              startTransition(() => {
                handleConfirm(); // Não retorna a promise diretamente
              })
            }
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Deleting.." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
