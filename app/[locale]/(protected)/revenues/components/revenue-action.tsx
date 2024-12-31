'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { SquarePen, Trash2 } from "lucide-react";
import { useRevenueContext } from './revenue-context';
import { deleteRevenue as executeDeleteRevenue } from '@/action/revenue-actions'
import CreateRevenue from './revenue-create';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import { pwButtonIconTable } from '@/lib/pw-components-styles';
import { Revenue } from "@/lib/model/types";

interface RevenueActionProps {
    revenue: Revenue;
}

const RevenueAction: React.FC<RevenueActionProps> = ({ revenue }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { deleteRevenue } = useRevenueContext();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setSelectedRowId(id);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedRowId) {
            const res = await executeDeleteRevenue(selectedRowId);
            if (res.ok) {
                deleteRevenue(selectedRowId);
            }
        }
        setOpenDeleteDialog(false);
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
    };    

    return (
        <>
            <CreateRevenue
                open={open}
                setOpen={setOpen}
                dataRevenue={revenue}
            />
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
            />            
            <div className="flex items-center gap-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className={pwButtonIconTable}
                                color="primary"
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
                                color="destructive"
                                onClick={() => handleDeleteClick(revenue.id)}
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

export default RevenueAction;
