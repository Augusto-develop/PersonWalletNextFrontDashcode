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
import { usePaymentContext } from './components/payment-context';


function calculateTotalInDespprocess(invoices: Invoice[]): number {
    return invoices
        .filter((invoice) => invoice.columnId === "despprocess") // Filtra apenas os invoices da coluna 'despprocess'
        .reduce((total, invoice) => total + (parseFloat(invoice.saldo) || 0), 0); // Soma os valores
}


const PaymentPage = () => {
    const [columns, setColumns] = useState<Column[]>(defaultCols);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    const { expensesForPayment, setExpensesForPayment, filter, setFilter } = usePaymentContext();
    const [invoices, setInvoices] = useState<Invoice[] | []>([]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

    const [totalDespesas, setTotalDespesas] = useState(0);
    const [totalReceitas, setTotalReceitas] = useState(0);
    const [totalApagar, setTotalApagar] = useState(0);
    const [totalDiff, setTotalDiff] = useState(0);
    const [saldoAfter, setSaldoAfter] = useState(0);

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
        if (expensesForPayment) {
            setInvoices(expensesForPayment.invoices || []);
        }
    }, [expensesForPayment]);

    // const totalDespesas = expensesForPayment?.totalsExpenses.total1Quinze + expensesForPayment?.totalsExpenses.total2Quinze;
    // const totalReceitas = expensesForPayment?.totalsRevenues.total1Quinze + expensesForPayment?.totalsRevenues.total2Quinze;
    // const totalApagar = calculateTotalInDespprocess(invoices);
    // const totalDiff = totalReceitas - totalDespesas;
    // const saldoAtual = 0;
    // const saldoAfter = saldoAtual - totalApagar;

    useEffect(() => {
        if (expensesForPayment) {
            // Atualiza os valores sempre que expensesForPayment mudar
            setTotalDespesas(
                expensesForPayment?.totalsExpenses.total1Quinze + expensesForPayment?.totalsExpenses.total2Quinze
            );
            setTotalReceitas(
                expensesForPayment?.totalsRevenues.total1Quinze + expensesForPayment?.totalsRevenues.total2Quinze
            );
        }
    }, [expensesForPayment]); // Esse useEffect será acionado sempre que expensesForPayment mudar

    useEffect(() => {
        // Calcular totalApagar e totalDiff baseado nas despesas e receitas atualizadas
        const totalApagarCalculated = calculateTotalInDespprocess(invoices);
        const totalDiffCalculated = totalReceitas - totalDespesas;
        setTotalApagar(totalApagarCalculated);
        setTotalDiff(totalDiffCalculated);

        // Atualiza o saldoAfter
        const saldoAtual = 0;
        setSaldoAfter(saldoAtual - totalApagarCalculated);
    }, [totalDespesas, totalReceitas, invoices]);

    return (

        <>
            {filter.isSubmit ? (
                <div className="">
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
                                                total={convertFloatToMoeda(expensesForPayment?.totalsExpenses.total1Quinze)}
                                                chartType="none"
                                                percentageContent={<span className="text-info">
                                                    {convertFloatToMoeda(expensesForPayment?.totalsExpenses.total1QuinzePago)}
                                                </span>}
                                                textControl="pagas"
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <OrdersBlock
                                                className='bg-default-50'
                                                title="Receitas | 1º Quinzena"
                                                total={convertFloatToMoeda(expensesForPayment?.totalsRevenues.total1Quinze)}
                                                chartType="none"
                                                percentageContent={
                                                    <span className={expensesForPayment?.totalsRevenues.total1QuinzeDiff < 0 ? "text-destructive" : "text-primary"}>
                                                        {expensesForPayment?.totalsRevenues.total1QuinzeDiff > 0 ?
                                                            `+${convertFloatToMoeda(expensesForPayment?.totalsRevenues.total1QuinzeDiff)}` :
                                                            convertFloatToMoeda(expensesForPayment?.totalsRevenues.total1QuinzeDiff)}
                                                    </span>
                                                }
                                                textControl="de saldo"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-between">
                                        <div className='flex-1'>
                                            <OrdersBlock
                                                className='bg-default-50'
                                                title="Despesas"
                                                total={convertFloatToMoeda(expensesForPayment?.totalsExpenses.total2Quinze)}
                                                chartColor="#f1595c"
                                                chartType="none"
                                                percentageContent={<span className="text-info">
                                                    {convertFloatToMoeda(expensesForPayment?.totalsExpenses.total2QuinzePago)}
                                                </span>}
                                                textControl="pagas"
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <OrdersBlock
                                                className='bg-default-50'
                                                title="Receitas | 2º Quinzena"
                                                total={convertFloatToMoeda(expensesForPayment?.totalsRevenues.total2Quinze)}
                                                chartType="none"
                                                chartColor="#f1595c"
                                                percentageContent={
                                                    <span className={expensesForPayment?.totalsRevenues.total2QuinzeDiff < 0 ? "text-destructive" : "text-primary"}>
                                                        {expensesForPayment?.totalsRevenues.total2QuinzeDiff > 0 ?
                                                            `+${convertFloatToMoeda(expensesForPayment?.totalsRevenues.total2QuinzeDiff)}` :
                                                            convertFloatToMoeda(expensesForPayment?.totalsRevenues.total2QuinzeDiff)}
                                                    </span>
                                                }
                                                textControl="de saldo"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-between">
                                        <div className='flex-1'>
                                            <OrdersBlock
                                                className='bg-default-50'
                                                title="Total à Pagar"
                                                total={convertFloatToMoeda(totalApagar)}
                                                chartType="none"
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <OrdersBlock
                                                className='bg-default-50'
                                                title="Saldo Atual"
                                                total="0,00"
                                                chartColor="#4669fa"
                                                chartType="none"
                                                percentageContent={
                                                    <span className={saldoAfter < 0 ? "text-destructive" : "text-primary"}>
                                                        {saldoAfter > 0 ? `+${convertFloatToMoeda(saldoAfter)}` : convertFloatToMoeda(saldoAfter)}
                                                    </span>
                                                }
                                                textControl="de saldo"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-between">
                                        <div className='flex-1'>
                                            <OrdersBlock
                                                className='bg-default-50'
                                                title="Total das Despesas"
                                                total={convertFloatToMoeda(totalDespesas)}
                                                chartColor="#f1595c"
                                                chartType="none"
                                            // percentageContent={<span className="text-destructive">
                                            //     + 800,00
                                            // </span>}
                                            // textControl="que mês anterior"
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <OrdersBlock
                                                className='bg-default-50'
                                                title="Total das Receitas "
                                                total={convertFloatToMoeda(totalReceitas)}
                                                chartColor="#f1595c"
                                                chartType="none"
                                                percentageContent={
                                                    <span className={totalDiff < 0 ? "text-destructive" : "text-primary"}>
                                                        {totalDiff > 0 ?
                                                            `+${convertFloatToMoeda(totalDiff)}` :
                                                            convertFloatToMoeda(totalDiff)}
                                                    </span>
                                                }
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
            ) : (
                <div className="text-center text-gray-500 mt-24">

                </div>
            )}
        </>
    )

}

export default PaymentPage