"use client"
import React, { useEffect } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { useExpenseContext } from "./components/expense-context";
import { convertFloatToMoeda } from "@/lib/utils";
import ExpenseAction from "./components/expense-action";
import { Expense } from "@/lib/model/types";
import { TypeCredit } from "@/lib/model/enums";
import OrdersBlock from "@/components/blocks/payment-block";
import { getInvoiceSums } from "@/action/expense-actions";

const ListTable = () => {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const { expenses, filter, invoiceSums, setInvoiceSums, categoriaOptions } =
        useExpenseContext();

    const isEditRecurring: boolean = filter.credit?.type === TypeCredit.DESPESAFIXA;
    const isLending: boolean = filter.credit?.type === TypeCredit.EMPRESTIMO;

    useEffect(() => {
        if (expenses) {
            const fetchSumns = async () => {
                setInvoiceSums(await getInvoiceSums(
                    filter.credit?.value,
                    filter.mes,
                    filter.ano,
                ));
            }

            fetchSumns();
        }
    }, [expenses]);

    const getColumnAlignment = (columnId: string) => {
        switch (columnId) {
            case "categoriaId":
            case "description":
            case "actions":
                return "text-left";
            case "lancamento":
            case "viewparcela":
                return "text-center";
            case "valor":
                return "text-right";
            default:
                return "";
        }
    };

    const columns: ColumnDef<Expense>[] = [
        {
            accessorKey: "categoriaId",
            header: "Categoria",
            cell: ({ row }) => {
                const categoriaId = row.getValue("categoriaId");
                const categoria = categoriaOptions.find(option => option.value === categoriaId);
                return (
                    <div className="font-medium text-sm leading-4 whitespace-nowrap">
                        {categoria ? categoria.label : "Categoria não encontrada"}
                    </div>
                );
            }
        },
        {
            accessorKey: "lancamento",
            header: isEditRecurring || isLending ? "Vencimento" : "Data da Compra",
            cell: ({ row }) => (
                <div className="font-medium text-sm leading-4 whitespace-nowrap">
                    {row.getValue("lancamento")}
                </div>
            )
        },
        {
            accessorKey: "description",
            header: "Descrição",
            cell: ({ row }) => (
                <div className="font-medium text-sm leading-4 whitespace-nowrap">
                    {row.getValue("description")}
                </div>
            )
        },
        {
            accessorKey: "viewparcela",
            header: "Parcela",
            cell: ({ row }) => (
                <div className="font-medium text-sm leading-4 whitespace-nowrap">
                    {row.getValue("viewparcela")}
                </div>
            )
        },
        {
            accessorKey: "valor",
            header: "Valor",
            cell: ({ row }) => (
                <div className="font-medium text-sm leading-4 whitespace-nowrap">
                    {convertFloatToMoeda(row.getValue("valor"))}
                </div>
            )
        },
        {
            id: "actions",
            accessorKey: "action",
            header: "Action",
            enableHiding: false,
            cell: ({ row }) => <ExpenseAction expense={row.original} />
        }
    ]

    const table = useReactTable({
        data: expenses,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        }
    })

    return (
        <>
            {filter.isSubmit ? (
                <>
                    <div className="space-y-5 mb-2">
                        <Card className='bg-transparent shadow-none'>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 place-content-center">
                                    <div className="flex flex-col">
                                        <OrdersBlock
                                            className='bg-default-50'
                                            title="Fatura Anterior"
                                            total={convertFloatToMoeda(invoiceSums.previous)}
                                            chartType="none"
                                            percentageContent={
                                                <span className="text-primary">
                                                    {convertFloatToMoeda(invoiceSums.previous)}
                                                </span>
                                            }
                                            textControl="pago"
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <OrdersBlock
                                            className='bg-default-50'
                                            title="Fatura Atual"
                                            total={convertFloatToMoeda(invoiceSums.current)}
                                            chartType="none"
                                            percentageContent={<span className="text-info">80%</span>}
                                            textControl="pago"
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <OrdersBlock
                                            className='bg-default-50'
                                            title="Saldo em aberto da próxima fatura"
                                            total={convertFloatToMoeda(invoiceSums.next)}
                                            chartType="none"
                                            percentageContent={<span className="text-info">
                                                {convertFloatToMoeda(invoiceSums.future)}
                                            </span>}
                                            textControl="Saldo em aberto total"
                                        />
                                    </div>
                                    {/* <div className='flex-1'>
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
                                </div> */}
                                </div>
                                {/* <div className="flex gap-2 justify-between">
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
                            </div> */}

                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="px-3 bg-default-100">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                // Obtém o alinhamento da coluna usando getColumnAlignment
                                                const headerAlignment = getColumnAlignment(header.column.id);

                                                return (
                                                    <TableHead key={header.id} className={headerAlignment}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody >
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                                {row.getVisibleCells().map((cell) => {
                                                    // Chama a função getCellAlignment para obter o alinhamento da célula
                                                    const cellAlignment = getColumnAlignment(cell.column.id);

                                                    return (
                                                        <TableCell
                                                            key={cell.id}
                                                            className={cellAlignment}  // Passa o alinhamento como className
                                                        >
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <div className="text-center text-gray-500 mt-24">

                </div>
            )}
        </>
    )
}
export default ListTable;
