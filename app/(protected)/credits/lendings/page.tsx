// @route-protected
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
import { useLendingContext} from "./components/lending-context";
import { convertFloatToMoeda } from "@/lib/utils";
import { useEffect } from "react";
import { getLendings } from "@/action/lending-actions";
import LendingAction from "./components/lending-action";
import { avatarComponents } from "@/components/pwicons/pwicons";
import { Avatar } from "@/components/ui/avatar";
import { Lending, IconType, IconAvatar } from "@/lib/model/types";

const ListTable = () => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const { lendings, setLendings, deleteLending } = useLendingContext();

    useEffect(() => {
        const fetchLendings = async () => {
            const data: Lending[] = await getLendings();
            setLendings(data);
        };

        fetchLendings();
    }, [setLendings]);

    const columns: ColumnDef<Lending>[] = [
        {
            accessorKey: "descricao",
            header: "Descrição",
            cell: ({ row }) => {
                const descricao = row.getValue("descricao") as IconAvatar;
                const texto = descricao?.text ?? "";
                const avatar = descricao?.avatar ?? "";
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
                                {texto}
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            accessorKey: "diavenc",
            header: "Vencimento",
            cell: ({ row }) => {
                return (
                    <div className="font-medium text-sm leading-4 whitespace-nowrap">
                        {row.getValue("diavenc")}
                    </div>
                )
            }
        },
        {
            accessorKey: "valorcredito",
            header: "Valor",
            cell: ({ row }) => {
                return (
                    <div className="font-medium text-sm leading-4 whitespace-nowrap">
                        {convertFloatToMoeda(row.getValue("valorcredito"))}
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
                    <LendingAction lending={row.original} />
                )
            }
        }
    ]

    const table = useReactTable({
        data: lendings,
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