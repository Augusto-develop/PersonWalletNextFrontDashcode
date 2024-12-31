import { DragStartEvent, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column, Invoice } from "@/lib/model/types"; // Ajuste o caminho conforme sua estrutura de arquivos

// Função para iniciar o drag
export function onDragStartHandler(
    event: DragStartEvent,
    setActiveColumn: (column: Column | null) => void,
    setActiveInvoice: (invoice: Invoice | null) => void
) {
    if (event.active.data.current?.type === "Column") {
        setActiveColumn(event.active.data.current.column);
        return;
    }

    if (event.active.data.current?.type === "Invoice") {
        setActiveInvoice(event.active.data.current.invoice);
        return;
    }
}

// Função para finalizar o drag
export function onDragEndHandler(
    event: DragEndEvent,
    columns: Column[],
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
    setActiveColumn: (column: Column | null) => void,
    setActiveInvoice: (invoice: Invoice | null) => void
) {
    setActiveColumn(null);
    setActiveInvoice(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
        const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
        const overColumnIndex = columns.findIndex((col) => col.id === overId);

        return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
}

// Função para gerenciar drag sobre elementos
export function onDragOverHandler(
    event: DragOverEvent,
    invoices: Invoice[],
    setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>
) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAInvoice = active.data.current?.type === "Invoice";
    const isOverAInvoice = over.data.current?.type === "Invoice";

    const validColumnsQ1 = ["quin1desp", "despprocess", "desppag"];
    const validColumnsQ2 = ["quin2desp", "despprocess", "desppag"];

    if (!isActiveAInvoice) return;

    if (isActiveAInvoice && isOverAInvoice) {
        setInvoices((invoices) => {
            const activeIndex = invoices.findIndex((t) => t.id === activeId);
            const overIndex = invoices.findIndex((t) => t.id === overId);

            if (activeIndex === -1 || overIndex === -1) return invoices;

            const activeInvoice = invoices[activeIndex];
            const isOverIdWithSameColumnOrigem = invoices.some(
                (invoice) => invoice.id === overId && invoice.columnOrigem === activeInvoice.columnOrigem
            );

            if (
                isOverIdWithSameColumnOrigem ||
                (activeInvoice.columnOrigem === "quin1desp" && validColumnsQ1.includes(overId.toString())) ||
                (activeInvoice.columnOrigem === "quin2desp" && validColumnsQ2.includes(overId.toString()))
            ) {
                console.log("Movimentação permitida.");
            } else {
                console.log("Movimentação bloqueada devido às restrições de columnOrigem.");
                return invoices;
            }

            if (invoices[activeIndex].columnId !== invoices[overIndex].columnId) {
                invoices[activeIndex].columnId = invoices[overIndex].columnId;
                return arrayMove(invoices, activeIndex, overIndex - 1);
            }

            return arrayMove(invoices, activeIndex, overIndex);
        });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveAInvoice && isOverAColumn) {
        setInvoices((invoices) => {
            const activeIndex = invoices.findIndex((t) => t.id === activeId);
            if (activeIndex === -1) return invoices;

            const activeInvoice = invoices[activeIndex];
            const isOverIdWithSameColumnOrigem = invoices.some(
                (invoice) => invoice.id === overId && invoice.columnOrigem === activeInvoice.columnOrigem
            );

            if (
                isOverIdWithSameColumnOrigem ||
                (activeInvoice.columnOrigem === "quin1desp" && validColumnsQ1.includes(overId.toString())) ||
                (activeInvoice.columnOrigem === "quin2desp" && validColumnsQ2.includes(overId.toString()))
            ) {
                console.log("Movimentação permitida ao arrastar diretamente para uma coluna.");
            } else {
                console.log("Movimentação bloqueada ao arrastar diretamente para uma coluna.");
                return invoices;
            }

            activeInvoice.columnId = overId.toString();
            return arrayMove(invoices, activeIndex, activeIndex);
        });
    }
}
