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
import { Category, useCategoryContext } from './category-context';
import { deleteCategory as executeDeleteCategory } from '@/action/category-actions'
import CreateCategory from './category-create';

// Add id as a prop to the component
interface CategoryActionProps {
    category: Category;  // The id of the credit card
}

const CategoryAction: React.FC<CategoryActionProps> = ({ category }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { categories, setCategories, deleteCategory } = useCategoryContext(); // Access context
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
            const res = await executeDeleteCategory(selectedRowId);
            if (res.ok) {
                deleteCategory(selectedRowId);
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
            <CreateCategory
                open={open}
                setOpen={setOpen}
                dataCategory={category}
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
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                        className="py-2 border-b border-default-200 text-default-600 focus:bg-default focus:text-default-foreground rounded-none cursor-pointer"
                    >
                        <SquarePen className="w-3.5 h-3.5 me-1" />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleDeleteClick(category.id)}
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

export default CategoryAction