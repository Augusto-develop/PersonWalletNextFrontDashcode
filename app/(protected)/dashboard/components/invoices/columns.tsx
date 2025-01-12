"use client"

import {
  ColumnDef,
} from "@tanstack/react-table"
import { Eye, MoreVertical, SquarePen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar } from "@/components/ui/avatar"
import { avatarComponents } from "@/components/pwicons/pwicons"
import { IconType } from "@/lib/model/types";
import { cn } from "@/lib/utils"
import React from "react"

export type DataProps = {
  id: string | number;
  card: {
    name: string;
    avatar: string;
    image: string;
  };
  fechamento: string;
  vencimento: string;
  valor: string;
  status?: "paid" | "due" | "cancel";
  action: React.ReactNode;
}

export const columns: ColumnDef<DataProps>[] = [
  {
    accessorKey: "card",
    header: "CARTÃO / DESPESA",
    cell: ({ row }) => {
      const card = row.original.card;
      const IconComponent = avatarComponents[card.avatar as IconType];
      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex gap-3 items-center">
            {IconComponent ? (
              <Avatar
                className="rounded w-8 h-8"
              >
                {/* {card?.image ? (
                <AvatarImage src={card.image} />
              ) : (
                <AvatarFallback>AB</AvatarFallback>
              )} */}
                <IconComponent />
              </Avatar>
            ) : (
              <div>Error: Icon not found</div>
            )}
            <span className="text-sm text-default-600 whitespace-nowrap">
              {card?.name ?? "Unknown User"}
            </span>
          </div>
        </div>
      )
    }
  },
  // {
  //   accessorKey: "history",
  //   header: "History",
  //   cell: ({ row }) => {
  //     return (
  //       <div>
  //         <div className="text-default-600">

  //         </div>
  //         <div className="text-default-500 text-xs">
  //           Trans ID:    {row.original.history.transId}
  //         </div>
  //       </div>
  //     )
  //   }
  // },
  {
    accessorKey: "fechamento",
    header: "FECHAMENTO",
    cell: ({ row }) => {
      return (
        <span>{row.getValue("fechamento")}</span>
      )
    }
  },
  {
    accessorKey: "vencimento",
    header: "VENCIMENTO",
    cell: ({ row }) => {
      return (
        <span>{row.getValue("vencimento")}</span>
      )
    }
  },
  {
    accessorKey: 'status',
    header: 'VALOR',
    cell: ({ row }) => {
      const status = (row.getValue<string>('status') || 'paid') as 'paid' | 'due' | 'cancel';
      const classes: { [key in 'paid' | 'due' | 'cancel']: string } = {
        paid: 'text-primary',
        due: 'text-warning',
        cancel: 'text-destructive',
      };
      return <span className={cn(classes[status])}>{row.original.valor}</span>;
    }
  },
  {
    id: "actions",
    accessorKey: "action",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex  justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="bg-transparent text-default-700 ring-offset-transparent hover:bg-transparent hover:ring-0 hover:ring-transparent"
              >
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4 " />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0" align="end">
              <DropdownMenuItem className="p-2 border-b text-default-700 group focus:bg-default focus:text-primary-foreground rounded-none">
                <Eye className="w-4 h-4 me-1.5" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem className="p-2 border-b text-default-700 group focus:bg-default focus:text-primary-foreground rounded-none">
                <SquarePen className="w-4 h-4 me-1.5" />
                Edit</DropdownMenuItem>
              <DropdownMenuItem className="p-2 border-b text-destructive group bg-destructive/30 focus:bg-destructive focus:text-destructive-foreground rounded-none">
                <Trash2 className="w-4 h-4 me-1.5" />
                Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]