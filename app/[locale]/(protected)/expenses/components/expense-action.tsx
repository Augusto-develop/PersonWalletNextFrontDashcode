'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { Expense, useExpenseContext } from './expense-context';
import { deleteExpense as executeDeleteExpense } from '@/action/expense-actions'
import CreateExpense from './expense-create';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';

// Add id as a prop to the component
interface ExpenseActionProps {
    expense: Expense;  // The id of the credit card
}

const ExpenseAction: React.FC<ExpenseActionProps> = ({ expense }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { expenses, setExpenses, deleteExpense } = useExpenseContext(); // Access context
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
            const res = await executeDeleteExpense(selectedRowId);
            if (res.ok) {
                deleteExpense(selectedRowId);
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
            <CreateExpense
                open={open}
                setOpen={setOpen}
                dataExpense={expense}
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
                                className="w-7 h-7 ring-offset-transparent border-default-200 dark:border-default-300  text-default-400"
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
                                className="w-7 h-7 ring-offset-transparent border-default-200 dark:border-default-300  text-default-400"
                                color="secondary"
                                onClick={() => handleDeleteClick(expense.id)}
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

export default ExpenseAction