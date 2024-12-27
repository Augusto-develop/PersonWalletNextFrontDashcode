"use client"
import * as React from "react"
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
import { useCashPaymentContext } from "./components/cashpayment-context";
import { useEffect } from "react";
import { getCashPayments } from "@/action/cashpayment-actions";
import CashPaymentAction from "./components/cashpayment-action";
import { CashPayment } from "@/lib/model/types";

const ListTable = () => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const { cashpayments, setCashPayments, deleteCashPayment } = useCashPaymentContext();

    useEffect(() => {
        const fetchCashPayments = async () => {
            const data: CashPayment[] = await getCashPayments();
            setCashPayments(data);
        };

        fetchCashPayments();
    }, []);

    const columns: ColumnDef<CashPayment>[] = [
        {
            accessorKey: "descricao",
            header: "Descrição",
            cell: ({ row }) => {
                return (
                    <div className="font-medium text-card-foreground/80">
                        <div className="flex gap-3 items-center">
                            <div className="font-medium text-sm leading-4 whitespace-nowrap">
                                {row.getValue("descricao")}
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            id: "actions",
            accessorKey: "action",
            header: "Action",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <CashPaymentAction cashpayment={row.original} />
                )
            }
        }
    ]

    const table = useReactTable({
        data: cashpayments,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        //getPaginationRowModel: getPaginationRowModel(),
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

    const getColumnAlignment = (columnId: string) => {
        console.log(columnId);
        switch (columnId) {
            case "valorcredito":
            case "parcela":
                return "text-right";
            case "diavenc":
                return "text-center";
            default:
                return "";
        }
    };

    return (
        <>
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
    )
}
export default ListTable;