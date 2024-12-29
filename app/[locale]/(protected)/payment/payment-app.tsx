'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { type Column, type Task } from './data';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import ColumnContainer from "./column"
import TaskCard from './task';
import { createPortal } from "react-dom";
import AddBoard from './add-board';
import CreateTask from "./create-task";
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import OrdersBlock from '@/components/blocks/payment-block';
import { getCreditInvoice } from "@/action/creditcard-actions";
import { Invoice } from "@/lib/model/types";
import { faker } from "@faker-js/faker";


const defaultCols = [
    {      
      id: "quin1desp",
      title: "Despesas | 1º Quinzena",
    },
    {      
      id: "quin2desp",
      title: "Despesas | 2º Quinzena",
    },
    {
      id: "despprocess",
      title: "Despesas em Pagamento",
    },
    {
      id: "desppag",
      title: "Despesas Pagas",
    },
  ];

const KanBanApp = () => {
    const [columns, setColumns] = useState<Column[]>(defaultCols);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    const [tasks, setTasks] = useState<Invoice[] | []>([]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Invoice | null>(null);

    // create task state 
    const [open, setOpen] = useState<boolean>(false);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveAColumn = active.data.current?.type === "Column";
        if (!isActiveAColumn) return;

        console.log("DRAG END");

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

            const overColumnIndex = columns.findIndex((col) => col.id === overId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;


        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {

                    tasks[activeIndex].columnId = tasks[overIndex].columnId;
                    return arrayMove(tasks, activeIndex, overIndex - 1);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === "Column";


        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                tasks[activeIndex].columnId = overId.toString();
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }


    useEffect(() => {
        const fetchExpenses = async () => {
            const fetchedExpenses = await getCreditInvoice({
                mesfat: '01',
                anofat: '2025',
            });
            setTasks(fetchedExpenses);
        };

        fetchExpenses();
    }, []);




    return (
        <>
            <div className="">
                <div className="flex gap-2 mb-5">
                    <div className="flex-1 font-medium lg:text-2xl text-xl capitalize text-default-900">
                        Payment
                    </div>
                    <div className="flex-none">
                        {/* <AddBoard /> */}
                    </div>
                </div>
                <div className="space-y-5 mb-2">
                    <Card className='bg-transparent shadow-none'>
                        <CardContent className="p-0">
                            <div className="grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 
                            gap-4 place-content-center">
                                <div className="flex gap-2 justify-between">
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            title="Despesas"
                                            total="3.000,00"
                                            chartType="none"
                                            percentageContent={<span className="text-info">800,00</span>}
                                            textControl="pagas"
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            title="Receitas | 1º Quinzena"
                                            total="2.800,00"
                                            chartType="none"
                                            percentageContent={<span className="text-destructive">- 200,00</span>}
                                            textControl="que mês anterior"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-between">
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            title="Despesas"
                                            total="1.600,00"
                                            chartColor="#f1595c"
                                            chartType="none"
                                            percentageContent={<span className="text-info">800,00</span>}
                                            textControl="pagas"
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            title="Receitas | 2º Quinzena"
                                            total="1.600,00"
                                            chartType="none"
                                            chartColor="#f1595c"
                                            percentageContent={<span className="text-primary">+ 500,00</span>}
                                            textControl="de saldo"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-between">
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            title="Total à Pagar"
                                            total="800,00"
                                            chartType="none"
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            title="Saldo Atual"
                                            total="800,00"
                                            chartColor="#4669fa"
                                            chartType="none"
                                            percentageContent={<span className="text-primary">+ 12,00</span>}
                                            textControl="saldo"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-between">
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            title="Total das Despesas"
                                            total="4.600,00"
                                            chartColor="#f1595c"
                                            chartType="none"
                                            percentageContent={<span className="text-destructive">+ 800,00</span>}
                                            textControl="que mês anterior"
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <OrdersBlock
                                            title="Total das Receitas "
                                            total="4.400,00"
                                            chartColor="#f1595c"
                                            chartType="none"
                                            percentageContent={<span className="text-destructive">- 200</span>}
                                            textControl="de saldo"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <DndContext
                    sensors={sensors}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragOver={onDragOver}
                >
                    <div className="flex gap-4 overflow-x-auto no-scrollbar justify-between">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <div key={col.id} className="flex-1 min-w-[200px]">
                                    <ColumnContainer
                                        column={col}
                                        tasks={tasks.filter((task) => task.columnId === col.id)}
                                        handleOpenTask={() => setOpen(true)}
                                    />
                                </div>
                            ))}
                        </SortableContext>
                    </div>

                    {createPortal(
                        <DragOverlay>
                            {activeColumn && (
                                <ColumnContainer
                                    column={activeColumn}
                                    handleOpenTask={() => setOpen(true)}
                                    tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                                />
                            )}
                            {activeTask && <TaskCard task={activeTask} />}
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>
            </div >
            <CreateTask
                open={open}
                setOpen={setOpen}
            />
        </>
    )

}

export default KanBanApp