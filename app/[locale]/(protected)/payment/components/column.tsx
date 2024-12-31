'use client'
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import InvoiceCard from "./invoice";
import EmptyInvoice from "./empty";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import React from "react";
import { Invoice, Column } from "@/lib/model/types";
import { Icon } from "@/components/ui/icon";

function ColumnContainer({ column, invoices, handleOpenInvoice }: {
    column: Column; invoices: Invoice[], handleOpenInvoice: () => void
}) {
    const [editMode, setEditMode] = useState<boolean>(false);

    const [deleteColumn, setDeleteColumn] = useState<boolean>(false);
    const invoicesIds = useMemo(() => {
        return invoices.map((invoice) => invoice.id);
    }, [invoices]);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <>
            <DeleteConfirmationDialog
                open={deleteColumn}
                onClose={() => setDeleteColumn(false)}
            />

            <Card
                ref={setNodeRef}
                style={style}
                className={cn("flex-1 w-auto bg-default-200 shadow-none app-payment-sortable-collums flex flex-col relative", {
                    "opacity-20": isDragging,
                })}
            >
                <CardHeader className="flex-none bg-card relative rounded-t-md py-4" {...attributes} {...listeners}>
                    <div className="flex items-center gap-2" >
                        <div className="flex-1 text-lg capitalize text-default-900 font-medium">{column.title}</div>
                        <div className="flex-none text-right">
                            <Icon icon="mdi:circle-slice-8" className={`w-5 h-5 ${column.ababgcolor}`} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 px-3 py-2 h-full overflow-y-auto no-scrollbar">
                    <div className=" space-y-2">
                        {invoices?.length === 0 && <EmptyInvoice />}
                        <SortableContext items={invoicesIds}>
                            {invoices.map((invoice) => (
                                <InvoiceCard invoice={invoice} key={invoice.id} />
                            ))}
                        </SortableContext>
                    </div>
                </CardContent>

            </Card>
        </>
    );
}

export default ColumnContainer;
