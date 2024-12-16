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
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Wallet, useWalletContext } from "./components/wallet-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { getWallets } from "@/action/wallet-actions";
import WalletAction from "./components/wallet-action";

const ListTable = () => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const { wallets, setWallets, deleteWallet } = useWalletContext();

    useEffect(() => {
        const fetchWallets = async () => {
            const data: Wallet[] = await getWallets();
            setWallets(data);
        };

        fetchWallets();
    }, []);

    const columns: ColumnDef<Wallet>[] = [
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
            accessorKey: "active",
            header: "Status",
            cell: ({ row }) => {
                const statusColors: Record<string, string> = {
                    Ativo: "bg-success/20 text-success",
                    Inativo: "bg-warning/20 text-danger",
                };
                const activeValue = row.getValue<boolean>("active");
                const status = activeValue ? 'Ativo' : 'Inativo';
                const statusStyles = statusColors[status];
                return (
                    <Badge className={cn("rounded-full px-5", statusStyles)}>
                        {status}{" "}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            accessorKey: "action",
            header: "Action",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <WalletAction wallet={row.original} />
                )
            }
        }
    ]

    const table = useReactTable({
        data: wallets,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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
                <CardHeader>
                    <CardTitle>Wallet List</CardTitle>
                </CardHeader>
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
                                        className="even:bg-default-100 px-6 h-20" >
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
                    <div className="flex items-center justify-end py-4 px-10">

                        <div className="flex-1 flex items-center gap-3">
                            <div className=" flex gap-2 items-center">
                                <div className="text-sm font-medium text-default-60">Go  </div>
                                <Input
                                    type="number"
                                    className="w-16 px-2"
                                    defaultValue={table.getState().pagination.pageIndex + 1}
                                    onChange={(e) => {
                                        const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                                        table.setPageIndex(pageNumber);
                                    }}
                                />
                            </div>
                            <div className="text-sm font-medium text-default-600">
                                Page{" "}  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-none">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className='w-8 h-8'
                            >
                                <ChevronLeft className='w-4 h-4' />
                            </Button>
                            {table.getPageOptions().map((page, pageIndex) => (
                                <Button
                                    key={`basic-data-table-${pageIndex}`}
                                    onClick={() => table.setPageIndex(pageIndex)}
                                    size="icon"
                                    className={`w-8 h-8 ${table.getState().pagination.pageIndex === pageIndex ? 'bg-default' : 'bg-default-300 text-default'}`}
                                >
                                    {page + 1}
                                </Button>

                            ))}
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className='w-8 h-8'
                            >
                                <ChevronRight className='w-4 h-4' />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
export default ListTable;