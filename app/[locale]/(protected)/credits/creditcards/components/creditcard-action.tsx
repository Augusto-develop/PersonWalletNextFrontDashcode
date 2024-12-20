'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreditCard, useCreditCardContext } from './creditcard-context';
import { deleteCreditCard as executeDeleteCreditCard } from '@/action/creditcard-actions'
import CreateCreditCard from './creditcard-create';

// Add id as a prop to the component
interface CreditCardActionProps {
    creditCard: CreditCard;  // The id of the credit card
}

const CreditCardAction: React.FC<CreditCardActionProps> = ({ creditCard }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { creditcards, setCreditCards, deleteCreditCard } = useCreditCardContext(); // Access context
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for dialog visibility
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null); // Store selected card ID for deletion

    // Handle delete button click
    const handleDeleteClick = (id: string) => {
        setSelectedCardId(id); // Set the selected card ID
        setOpenDeleteDialog(true); // Open the delete confirmation dialog
    };

    // Confirm deletion and delete the selected card
    const handleDeleteConfirm = async () => {
        if (selectedCardId) {
            const res = await executeDeleteCreditCard(selectedCardId);
            if (res.ok) {
                deleteCreditCard(selectedCardId);
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
            <CreateCreditCard
                open={open}
                setOpen={setOpen}
                dataCreditCard={creditCard}
            />
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm} // Close dialog without deletion             
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="icon"
                        className="flex-none bg-transparent ring-offset-transparent hover:bg-transparent hover:ring-0 hover:ring-transparent w-6"
                    >
                        <MoreVertical className="h-4 w-4 text-default-700" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0 overflow-hidden" align="end" >
                    {/* <DropdownMenuItem
                        className="py-2 border-b border-default-200 text-default-600 focus:bg-default focus:text-default-foreground rounded-none cursor-pointer"
                    >
                    <Link href={`/app/projects/${defaultCreditCards[0].id}`} className=' flex  items-center w-full'>
                        <Eye className="w-3.5 h-3.5 me-1" />
                        View
                    </Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                        className="py-2 border-b border-default-200 text-default-600 focus:bg-default focus:text-default-foreground rounded-none cursor-pointer"
                    >
                        <SquarePen className="w-3.5 h-3.5 me-1" />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleDeleteClick(creditCard.id)}
                        className="py-2 bg-destructive/30 focus:bg-destructive focus:text-destructive-foreground rounded-none cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5  me-1" />
                        Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default CreditCardAction