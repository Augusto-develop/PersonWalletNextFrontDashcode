"use client"
import { cn, convertFloatToMoeda } from "@/lib/utils"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { CircleDollarSign, MoreVertical, SquarePen, Trash2 } from "lucide-react";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { useState } from "react";
// import EditInvoice from "./edit-invoice";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { IconType, Invoice, StatusInvoice, StatusInvoiceText } from "@/lib/model/types";
import { avatarComponents } from "@/components/pwicons/pwicons";
import PayInvoice from "./invoice-pay";
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { usePaymentContext } from "./payment-context";
import { deleteMovement } from "@/action/movement-actions";

type idDeleteInvoice = {
    invoiceId: string;
    pagamentoId: string;
}

function InvoiceCard({ invoice }: { invoice: Invoice }) {
    // const { projectLogo, title, desc, startDate, endDate, progress, assignee, remainingDays } = invoice;
    const [open, setOpen] = useState<boolean>(false);
    const [payOpen, setPayOpen] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<idDeleteInvoice | null>(null);
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: invoice.id,
        data: {
            type: "Invoice",
            invoice,
        },
    });
    const { deletePaymentInInvoice} = usePaymentContext();


    let bgInvoice = "";
    switch (invoice.status) {
        case StatusInvoice.ABERTA:
            bgInvoice = "bg-default-50";
            break;
        case StatusInvoice.PAGO:
        case StatusInvoice.PAGOMAIOR:
            bgInvoice = "bg-success/20";
            break;
        case StatusInvoice.PAGOPARC:
            bgInvoice = "bg-success/20";
            break;
        case StatusInvoice.ATRASO:
            bgInvoice = "bg-warning/20";
            break;
        default:
            bgInvoice = "bg-default-50";
    }

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const IconComponent = avatarComponents[invoice.avatar as IconType];    

    const handleDeleteClick = (invoiceId: string, pagamentoId: string) => {
        setSelectedRowId({invoiceId, pagamentoId});
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedRowId) {
            const res = await deleteMovement(selectedRowId?.pagamentoId);
            if (res.ok) {
                deletePaymentInInvoice(selectedRowId?.invoiceId, selectedRowId?.pagamentoId);
            }
        }
        setOpenDeleteDialog(false);
    };

    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <>
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
            />
            <PayInvoice
                open={payOpen}
                setOpen={setPayOpen}
                dataInvoice={invoice}
            />
            <Card
                className={cn("", {
                    "opacity-10 bg-primary/50 ": isDragging,
                    [bgInvoice]: !isDragging,
                })}
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
            >
                <CardHeader className="flex-row gap-2 px-2.5 pb-0 pt-3 items-center space-y-0 justify-between">
                    <div className="flex-none">
                        {IconComponent ? (
                            <Avatar
                                className="rounded w-8 h-8"
                            >
                                <IconComponent />
                            </Avatar>
                        ) : (
                            <Icon icon={invoice.avatar} className='w-7 h-7 text-default-500 dark:text-secondary-foreground mr-2' />
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-default-600 text-lg font-medium w-auto truncate text-left capitalize ">{invoice.title}</h3>
                    </div>
                    <div className="flex-none text-right">
                        <Menubar className="h-8 p-0">
                            <MenubarMenu>
                                <MenubarTrigger className="h-8 p-0" asChild >
                                    <Button
                                        size="icon"
                                        className="flex-none ring-offset-transparent bg-transparent hover:bg-transparent hover:ring-0 hover:ring-transparent w-6"
                                    >
                                        <MoreVertical className="h-4 w-4 text-default-900" />
                                    </Button>
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem onClick={() => setPayOpen(true)}>
                                        Pagar
                                    </MenubarItem>
                                    {invoice.pagamentos && invoice.pagamentos.length > 0 && (
                                        <>
                                            <MenubarItem disabled>Pagamentos:</MenubarItem>
                                            <div className="px-3">
                                                <MenubarSeparator className="h-px bg-gray-300 my-1" />
                                            </div>
                                            {invoice.pagamentos.map((pagamento, index) => (
                                                <MenubarSub key={index}>
                                                    <MenubarSubTrigger>
                                                        {pagamento.ocorrencia} - {convertFloatToMoeda(pagamento.valor, true)}
                                                    </MenubarSubTrigger>
                                                    <MenubarSubContent>
                                                        <MenubarItem onClick={() => handleDeleteClick(invoice.id, pagamento.id)}>
                                                            Excluir
                                                        </MenubarItem>
                                                    </MenubarSubContent>
                                                </MenubarSub>
                                            ))}
                                        </>
                                    )}
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>

                        {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    className="flex-none ring-offset-transparent bg-transparent hover:bg-transparent hover:ring-0 hover:ring-transparent w-6"
                                >
                                    <MoreVertical className="h-4 w-4 text-default-900" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-0 overflow-hidden" align="end" >
                                <DropdownMenuItem
                                    className="py-2 border-b border-default-200 text-default-600 focus:bg-default focus:text-default-foreground rounded-none cursor-pointer"
                                    onClick={() => setPayOpen(true)}
                                >
                                    <CircleDollarSign className="w-3.5 h-3.5 me-1" />
                                    Pagar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="py-2 bg-destructive/30 text-destructive focus:bg-destructive focus:text-destructive-foreground rounded-none cursor-pointer"
                                    onClick={() => setOpen(true)}
                                >
                                    <Trash2 className="w-3.5 h-3.5  me-1" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu> */}
                    </div>
                </CardHeader>
                <CardContent className="p-2.5 pt-1">
                    <div className="flex gap-3 justify-between">
                        <div className="flex-1">
                            <div className="text-xs text-default-400 mb-1">Status</div>
                            <div className="text-xs text-default-600 font-medium">{StatusInvoiceText[invoice.status]}</div>
                        </div>
                        <div className="flex-1">
                            <div className="text-xs text-default-400 mb-1 text-center">Vencimento</div>
                            <div className="text-xs text-default-600 font-medium text-center">{invoice.diavenc}</div>
                        </div>
                        <div className="flex-1">
                            <div className="text-xs text-default-400 mb-1">Valor</div>
                            <div className="text-xs text-default-pw-700 font-medium">{convertFloatToMoeda(invoice.saldo)}</div>
                        </div>
                    </div>
                </CardContent>
            </Card >
        </>
    );
}

export default InvoiceCard;
