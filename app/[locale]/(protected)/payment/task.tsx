"use client"
import { cn, convertFloatToMoeda } from "@/lib/utils"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Task } from "./data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { useState } from "react";
import EditTask from "./edit-task";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { IconType, Invoice } from "@/lib/model/types";
import { avatarComponents } from "@/components/pwicons/pwicons";

function TaskCard({ task }: { task: Invoice }) {
    // const { projectLogo, title, desc, startDate, endDate, progress, assignee, remainingDays } = task;
    const [open, setOpen] = useState<boolean>(false);
    const [editTaskOpen, setEditTaskOpen] = useState<boolean>(false);
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const IconComponent = avatarComponents[task.avatar as IconType];

    return (
        <>
            <DeleteConfirmationDialog
                open={open}
                onClose={() => setOpen(false)}
            />
            <EditTask
                open={editTaskOpen}
                setOpen={setEditTaskOpen}
            />
            <Card
                className={cn("", {
                    "opacity-10 bg-primary/50 ": isDragging,
                })}
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
            >
                <CardHeader className="flex-row gap-2 p-2.5 items-center space-y-0 justify-between">
                    <div className="flex-none">
                        {IconComponent ? (
                            <Avatar
                                className="rounded w-8 h-8"
                            >
                                <IconComponent />
                            </Avatar>
                        ) : (
                            <Icon icon={task.avatar} className='w-5 h-5 text-default-500 dark:text-secondary-foreground mr-2' />
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-default-800 text-lg font-medium w-auto truncate text-left capitalize ">{task.title}</h3>
                    </div>
                    <div className="flex-none text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    className="flex-none ring-offset-transparent bg-transparent hover:bg-transparent hover:ring-0 hover:ring-transparent w-6"
                                >
                                    <MoreVertical className="h-4 w-4 text-default-900" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-0 overflow-hidden" align="end" >
                                <DropdownMenuItem
                                    className="py-2 border-b border-default-200 text-default-600 focus:bg-default focus:text-default-foreground rounded-none cursor-pointer"
                                    onClick={() => setEditTaskOpen(true)}
                                >
                                    <SquarePen className="w-3.5 h-3.5 me-1" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="py-2 bg-destructive/30 text-destructive focus:bg-destructive focus:text-destructive-foreground rounded-none cursor-pointer"
                                    onClick={() => setOpen(true)}
                                >
                                    <Trash2 className="w-3.5 h-3.5  me-1" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-2.5 pt-1">
                    {/* <div className="text-default-600 text-sm">{desc}</div> */}
                    <div className="flex gap-3 justify-between">
                        <div className="flex-1">
                            <div className="text-xs text-default-400 mb-1">Status</div>
                            <div className="text-xs text-default-600  font-medium">Aberta</div>
                        </div>
                        <div className="flex-1">
                            <div className="text-xs text-default-400 mb-1">Vencimento</div>
                            <div className="text-xs text-default-600  font-medium">{task.diavenc}</div>
                        </div>
                        <div className="flex-1">
                            <div className="text-xs text-default-400 mb-1">Total</div>
                            <div className="text-xs text-default-600  font-medium">{convertFloatToMoeda(task.total, true)}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

export default TaskCard;
