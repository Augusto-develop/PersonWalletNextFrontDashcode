'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { useCategoryContext } from './category-context';
import { deleteCategory as executeDeleteCategory } from '@/action/category-actions'
import CreateCategory from './category-create';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import { Category } from "@/lib/model/types";
import { pwButtonIconTable } from '@/lib/pw-components-styles';

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
                                onClick={() => handleDeleteClick(category.id)}
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

export default CategoryAction