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
import { Expense, useExpenseContext } from "./components/expense-context";
import { convertFloatToMoeda, convertDatetimeToDate } from "@/lib/utils";
import ExpenseAction from "./components/expense-action";

const ListTable = () => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const { expenses } = useExpenseContext();

    const columns: ColumnDef<Expense>[] = [
        {
            accessorKey: "lancamento",
            header: "Data",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-3">
                        <div className="font-medium text-sm leading-4 whitespace-nowrap">
                            {convertDatetimeToDate(row.getValue("lancamento"))}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "description",
            header: "Descrição",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-3">
                        {/* <Avatar className="w-10 h-10 shadow-none border-none bg-transparent hover:bg-transparent">
                            <AvatarImage src={row.original.projectLogo} />
                            <AvatarFallback> DC</AvatarFallback>
                        </Avatar> */}
                        <div className="font-medium text-sm leading-4 whitespace-nowrap">
                            {row.getValue("description")}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "viewparcela",
            header: "Parcela",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-3">
                        <div className="font-medium text-sm leading-4 whitespace-nowrap">
                            {row.getValue("viewparcela")}
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "valor",
            header: "Valor",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-3">
                        <div className="font-medium text-sm leading-4 whitespace-nowrap">
                            {convertFloatToMoeda(row.getValue("valor"), true)}
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
                    <ExpenseAction expense={row.original} />
                )
            }
        }
    ]

    const table = useReactTable({
        data: expenses,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
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
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="px-3 bg-default-100">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    // className="even:bg-default-100 px-6 h-20" 
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
        </>
    )
}
export default ListTable;