// @route-protected
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
import { useRevenueContext } from "./components/revenue-context";
import { convertFloatToMoeda } from "@/lib/utils";
import RevenueAction from "./components/revenue-action";
import { Revenue, WalletOption, IconType } from "@/lib/model/types";
import { createOptionsWallets } from "@/action/wallet-actions";
import { Avatar } from "@/components/ui/avatar";
import { avatarComponents } from "@/components/pwicons/pwicons";


const ListTable = () => {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const { revenues, filter, categoriaOptions } = useRevenueContext();
    const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);

    useEffect(() => {
        const fetchWalletOptions = async () => {
            const options: WalletOption[] = await createOptionsWallets();
            setWalletOptions(options);
        };

        fetchWalletOptions();
    }, []);

    const columns: ColumnDef<Revenue>[] = [
        {
            accessorKey: "carteiraId",
            header: "Carteira",
            cell: ({ row }) => {
                const carteiraId = row.getValue("carteiraId");
                const carteira = walletOptions.find(option => option.value === carteiraId);
                const avatar = carteira?.avatar ?? "";
                const IconComponent = avatarComponents[avatar as IconType];

                return (
                    <div className="font-medium text-card-foreground/80">
                        <div className="flex gap-3 items-center">
                            {IconComponent ? (
                                <Avatar
                                    className="rounded w-8 h-8"
                                >
                                    <IconComponent />
                                </Avatar>
                            ) : (
                                <div>Error: Icon not found</div>
                            )}
                            <div className="font-medium text-sm leading-4 whitespace-nowrap">
                                {carteira?.label}
                            </div>
                        </div>
                    </div>
                );
            }
        },
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
            accessorKey: "descricao",
            header: "Descrição",
            cell: ({ row }) => (
                <div className="font-medium text-sm leading-4 whitespace-nowrap">
                    {row.getValue("descricao")}
                </div>
            )
        },
        {
            accessorKey: "diareceb",
            header: "Dia",
            cell: ({ row }) => (
                <div className="font-medium text-sm leading-4 whitespace-nowrap">
                    {row.getValue("diareceb")}
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
            cell: ({ row }) => <RevenueAction revenue={row.original} />
        }
    ]

    const table = useReactTable({
        data: revenues,
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

    const getColumnAlignment = (columnId: string) => {
        switch (columnId) {
            case "carteiraId":
            case "categoriaId":
            case "descricao":
            case "actions":
                return "text-left";
            case "diareceb":
            case "valor":
                return "text-right";
            default:
                return "";
        }
    };

    return (
        <>
            {filter.isSubmit ? (
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
            ) : (
                <div className="text-center text-gray-500 mt-24">

                </div>
            )}
        </>
    )
}
export default ListTable;
