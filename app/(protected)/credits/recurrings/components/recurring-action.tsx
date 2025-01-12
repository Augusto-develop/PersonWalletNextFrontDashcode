'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { Eye, MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { useRecurringContext } from './recurring-context';
import { deleteRecurring as executeDeleteRecurring } from '@/action/recurring-actions';
import CreateRecurring from './recurring-create';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { pwButtonIconTable } from '@/lib/pw-components-styles';
import { Recurring } from "@/lib/model/types";



// Add id as a prop to the component
interface RecurringActionProps {
    recurring: Recurring;  // The id of the credit card
}

const RecurringAction: React.FC<RecurringActionProps> = ({ recurring }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { recurrings, setRecurrings, deleteRecurring } = useRecurringContext(); // Access context
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
            const res = await executeDeleteRecurring(selectedRowId);
            if (res.ok) {
                deleteRecurring(selectedRowId);
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
            <CreateRecurring
                open={open}
                setOpen={setOpen}
                dataRecurring={recurring}
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
                                onClick={() => handleDeleteClick(recurring.id)}
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

export default RecurringAction