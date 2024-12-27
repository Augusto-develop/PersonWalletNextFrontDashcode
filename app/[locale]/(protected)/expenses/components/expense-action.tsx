'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { SquarePen, Trash2 } from "lucide-react";
import { useExpenseContext } from './expense-context';
import { deleteExpense as executeDeleteExpense, deleteParcelasExpense, createParcelasExpense, convertDtoToExpense } from '@/action/expense-actions'
import CreateExpense from './expense-create';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import { pwButtonIconTable, pwButtonTextTable } from '@/lib/pw-components-styles';
import { Expense } from "@/lib/model/types";
import { ExpenseDto } from '@/action/types.schema.dto';

interface ExpenseActionProps {
    expense: Expense;
}

const ExpenseAction: React.FC<ExpenseActionProps> = ({ expense }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { editExpense, deleteExpense } = useExpenseContext();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openParcelasDialog, setOpenParcelasDialog] = useState(false);
    const [actionType, setActionType] = useState<"create" | "delete" | null>(null); // Track type of action
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setSelectedRowId(id);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedRowId) {
            const res = await executeDeleteExpense(selectedRowId);
            if (res.ok) {
                deleteExpense(selectedRowId);
            }
        }
        setOpenDeleteDialog(false);
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
    };
    
    const handleParcelasClick = (id: string, type: "create" | "delete") => {
        setSelectedRowId(id);
        setActionType(type);
        setOpenParcelasDialog(true);
    };

    const handleParcelasConfirm = async () => {
        if (selectedRowId && actionType) {
            try {

                let expenseDto: ExpenseDto | undefined;

                if (actionType === "create") {
                    expenseDto = await createParcelasExpense(selectedRowId);

                } else if (actionType === "delete") {

                    expenseDto = await deleteParcelasExpense(selectedRowId);
                }

                if (expenseDto) {
                    const row: Expense = convertDtoToExpense(expenseDto);
                    editExpense(row.id, row);
                }

            } catch (error) {
                console.error(`Erro ao processar parcelas (${actionType}) para o ID ${selectedRowId}:`, error);
            }
        }
        setOpenParcelasDialog(false);
    };

    const handleParcelasCancel = () => {
        setOpenParcelasDialog(false);
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
                onConfirm={handleDeleteConfirm}
            />
            <DeleteConfirmationDialog
                open={openParcelasDialog}
                onClose={handleParcelasCancel}
                onConfirm={handleParcelasConfirm}
                description={actionType === "create" ?
                    "Tem certeza de que deseja criar parcelas para este item?" :
                    "Tem certeza de que deseja excluir as parcelas deste item?"
                }
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
                {expense.isDelete && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className={pwButtonIconTable}
                                    color="destructive"
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
                )}
                {expense.isCreateParcelas && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={pwButtonTextTable}
                                    color="primary"
                                    onClick={() => handleParcelasClick(expense.id, "create")}
                                >
                                    Criar Parcelas
                                </Button>
                            </TooltipTrigger>
                            {/* <TooltipContent side="top" className="bg-primary text-primary-foreground">
                                <p>Criar Parcelas</p>
                            </TooltipContent> */}
                        </Tooltip>
                    </TooltipProvider>
                )}
                {expense.isDeleteParcelas && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={pwButtonTextTable}
                                    color="destructive"
                                    onClick={() => handleParcelasClick(expense.id, "delete")}
                                >
                                    Excluir Parcelas
                                </Button>
                            </TooltipTrigger>
                            {/* <TooltipContent side="top" className="bg-destructive text-destructive-foreground">
                                <p>Excluir Parcelas</p>
                            </TooltipContent> */}
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </>
    )
}

export default ExpenseAction;
