'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { type Column } from './components/data';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import ColumnContainer from "./components/column"
import InvoiceCard from './components/invoice';
import { createPortal } from "react-dom";
import { Card, CardContent } from "@/components/ui/card";
import OrdersBlock from '@/components/blocks/payment-block';
import { getCreditInvoice } from "@/action/payment-actions";
import { Invoice, defaultCols, ExpensesForPayment } from "@/lib/model/types";
import { onDragStartHandler, onDragEndHandler, onDragOverHandler } from "./components/dragAndDropHandlers";
import { convertFloatToMoeda } from '@/lib/utils';

const PaymentPage = () => {
    const [columns, setColumns] = useState<Column[]>(defaultCols);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    const [expensesForPayment, setExpensesForPayment] = useState<ExpensesForPayment | null>(null);
    const [invoices, setInvoices] = useState<Invoice[] | []>([]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

    // create invoice state 
    const [open, setOpen] = useState<boolean>(false);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    useEffect(() => {
        const fetchExpenses = async () => {
            const fetchedExpenses = await getCreditInvoice({
                mesfat: '01',
                anofat: '2025',
            });
            setExpensesForPayment(fetchedExpenses);
            setInvoices(fetchedExpenses.invoices);
        };

        fetchExpenses();
    }, []);

    return (
        <>
            <div className="">
                <div className="flex gap-2 mb-5">
                    <div className="flex-1 font-medium lg:text-2xl text-xl capitalize text-default-900">
                        Payment
                    </div>
                    <div className="flex-none">
                        {/* <AddBoard /> */}
                    </div>
                </div>
                <div className="space-y-5 mb-2">
                    <Card className='bg-transparent shadow-none'>
                        <CardContent className="p-0">
                            <div className="grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 
                            gap-4 place-content-center">
                                <div className="flex gap-2 justify-between">
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            className='bg-default-50'
                                            title="Despesas"
                                            total={convertFloatToMoeda(expensesForPayment?.totals.total1Quinze)}
                                            chartType="none"
                                            percentageContent={<span className="text-info">
                                                {convertFloatToMoeda(expensesForPayment?.totals.total1QuinzePago)}
                                            </span>}
                                            textControl="pagas"
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            className='bg-default-50'
                                            title="Receitas | 1º Quinzena"
                                            total="1,600,00"
                                            chartType="none"
                                            percentageContent={<span className="text-destructive">800,00</span>}
                                            textControl="que mês anterior"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-between">
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            className='bg-default-50'
                                            title="Despesas"
                                            total={convertFloatToMoeda(expensesForPayment?.totals.total2Quinze)}
                                            chartColor="#f1595c"
                                            chartType="none"
                                            percentageContent={<span className="text-info">
                                                {convertFloatToMoeda(expensesForPayment?.totals.total2QuinzePago)}
                                            </span>}
                                            textControl="pagas"
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            className='bg-default-50'
                                            title="Receitas | 2º Quinzena"
                                            total="1.600,00"
                                            chartType="none"
                                            chartColor="#f1595c"
                                            percentageContent={<span className="text-primary">+ 500,00</span>}
                                            textControl="de saldo"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-between">
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            className='bg-default-50'
                                            title="Total à Pagar"
                                            total="800,00"
                                            chartType="none"
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            className='bg-default-50'
                                            title="Saldo Atual"
                                            total="800,00"
                                            chartColor="#4669fa"
                                            chartType="none"
                                            percentageContent={<span className="text-primary">+ 12,00</span>}
                                            textControl="saldo"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-between">
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            className='bg-default-50'
                                            title="Total das Despesas"
                                            total="4.600,00"
                                            chartColor="#f1595c"
                                            chartType="none"
                                            percentageContent={<span className="text-destructive">+ 800,00</span>}
                                            textControl="que mês anterior"
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            className='bg-default-50'
                                            title="Total das Receitas "
                                            total="4.400,00"
                                            chartColor="#f1595c"
                                            chartType="none"
                                            percentageContent={<span className="text-destructive">- 200</span>}
                                            textControl="de saldo"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <DndContext
                    sensors={sensors}
                    onDragStart={(event) => onDragStartHandler(event, setActiveColumn, setActiveInvoice)}
                    onDragOver={(event) => onDragOverHandler(event, invoices, setInvoices)}
                    onDragEnd={(event) => onDragEndHandler(event, columns, setColumns, setActiveColumn, setActiveInvoice)}
                >
                    <div className="flex gap-4 overflow-x-auto no-scrollbar justify-between">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <div key={col.id} className="flex-1 min-w-[200px]">
                                    <ColumnContainer
                                        column={col}
                                        invoices={invoices.filter((invoice) => invoice.columnId === col.id)}
                                        handleOpenInvoice={() => setOpen(true)}
                                    />
                                </div>
                            ))}
                        </SortableContext>
                    </div>

                    {createPortal(
                        <DragOverlay>
                            {activeColumn && (
                                <ColumnContainer
                                    column={activeColumn}
                                    handleOpenInvoice={() => setOpen(true)}
                                    invoices={invoices.filter((invoice) => invoice.columnId === activeColumn.id)}
                                />
                            )}
                            {activeInvoice && <InvoiceCard invoice={activeInvoice} />}
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>
            </div >
        </>
    )

}

export default PaymentPage