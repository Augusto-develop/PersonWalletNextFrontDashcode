"use client"
import React, { useEffect, useState } from "react";
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
import { Expense, useExpenseContext } from "./components/expense-context";
import { convertFloatToMoeda, convertDatetimeToDate } from "@/lib/utils";
import ExpenseAction from "./components/expense-action";
import { CategoryOption, createOptionsCategories } from "@/action/category-actions";

const ListTable = () => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const { expenses, filter } = useExpenseContext();
    const [categoriaOptions, setCategoriaOptions] = useState<CategoryOption[]>([]);    

    useEffect(() => {
        const fetchCategoryOptions = async () => {
            const options: CategoryOption[] = await createOptionsCategories();
            setCategoriaOptions(options);
        };

        fetchCategoryOptions();
    }, []);

    const columns: ColumnDef<Expense>[] = [
        {
            accessorKey: "categoriaId",
            header: "Categoria",
            cell: ({ row }) => {
                const categoriaId = row.getValue("categoriaId");
                const categoria = categoriaOptions.find(option => option.value === categoriaId);
                return (
                    <div className="flex items-center gap-3">
                        <div className="font-medium text-sm leading-4 whitespace-nowrap">
                            {categoria ? categoria.label : "Categoria não encontrada"}
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "lancamento",
            header: filter.isRecurring ? "Vencimento" : "Data da Compra",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="font-medium text-sm leading-4 whitespace-nowrap">
                        {row.getValue("lancamento")}
                    </div>
                </div>
            )
        },
        {
            accessorKey: "description",
            header: "Descrição",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="font-medium text-sm leading-4 whitespace-nowrap">
                        {row.getValue("description")}
                    </div>
                </div>
            )
        },
        {
            accessorKey: "viewparcela",
            header: "Parcela",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="font-medium text-sm leading-4 whitespace-nowrap">
                        {row.getValue("viewparcela")}
                    </div>
                </div>
            )
        },
        {
            accessorKey: "valor",
            header: "Valor",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="font-medium text-sm leading-4 whitespace-nowrap">
                        {convertFloatToMoeda(row.getValue("valor"))}
                    </div>
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
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="px-3 bg-default-100">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
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
            ) : (
                <div className="text-center text-gray-500 mt-24">

                </div>
            )}
        </>
    )
}
export default ListTable;
