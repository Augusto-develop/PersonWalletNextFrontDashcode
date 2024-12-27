'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { Eye, MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { useCashPaymentContext } from './cashpayment-context';
import { deleteCashPayment as executeDeleteCashPayment } from '@/action/cashpayment-actions';
import CreateCashPayment from './cashpayment-create';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { pwButtonIconTable } from '@/lib/pw-components-styles';
import { CashPayment } from "@/lib/model/types";

// Add id as a prop to the component
interface CashPaymentActionProps {
    cashpayment: CashPayment;  // The id of the credit card
}

const CashPaymentAction: React.FC<CashPaymentActionProps> = ({ cashpayment }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { cashpayments, setCashPayments, deleteCashPayment } = useCashPaymentContext(); // Access context
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for dialog visibility
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null); // Store selected card ID for deletion


    // Handle delete button click
    const handleDeleteClick = (id: string) => {
        setSelectedRowId(id); // Set the selected card ID
        setOpenDeleteDialog(true); // Open the delete confirmation dialog
    };

    // Confirm deletion and delete the selected card
    const handleDeleteConfirm = async () => {
        if (selectedRowId) {
            const res = await executeDeleteCashPayment(selectedRowId);
            if (res.ok) {
                deleteCashPayment(selectedRowId);
            }
        }
        setOpenDeleteDialog(false); // Close the dialog
    };

    // Cancel deletion
    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false); // Close the dialog without deletion
    };

    return (
        <>
            <CreateCashPayment
                open={open}
                setOpen={setOpen}
                dataCashPayment={cashpayment}
            />
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm} // Close dialog without deletion             
            />
            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className={pwButtonIconTable}
                                color="secondary"
                                onClick={() => setOpen(true)}
                            >
                                <SquarePen className="w-3 h-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            <p>Editar</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className={pwButtonIconTable}
                                color="secondary"
                                onClick={() => handleDeleteClick(cashpayment.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-destructive text-destructive-foreground">
                            <p>Excluir</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </>
    )
}

export default CashPaymentAction