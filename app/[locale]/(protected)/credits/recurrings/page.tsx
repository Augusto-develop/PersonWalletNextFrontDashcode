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
import { useRecurringContext } from "./components/recurring-context";
import { convertFloatToMoeda } from "@/lib/utils";
import { useEffect } from "react";
import { getRecurrings } from "@/action/recurring-actions";
import RecurringAction from "./components/recurring-action";
import { CategoryOption, Recurring } from "@/lib/model/types";
import { createOptionsCategories } from "@/action/category-actions"

const ListTable = () => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const { recurrings, setRecurrings, deleteRecurring } = useRecurringContext();
    const [categoriaOptions, setCategoriaOptions] = React.useState<CategoryOption[]>([]);

    useEffect(() => {
        const fetchRecurrings = async () => {
            const data: Recurring[] = await getRecurrings();
            setRecurrings(data);
        };

        fetchRecurrings();

        const fetchCategoryOptions = async () => {
            const options: CategoryOption[] = await createOptionsCategories();
            setCategoriaOptions(options);
        };

        fetchCategoryOptions();
    }, []);

    const columns: ColumnDef<Recurring>[] = [
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
                    <RecurringAction recurring={row.original} />
                )
            }
        }
    ]

    const table = useReactTable({
        data: recurrings,
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
        switch (columnId) {
            case "categoriaId":
            case "descricao":
                return "text-left";
            case "diavenc":           
                return "text-center";
            case "valorcredito":            
                return "text-right";            
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