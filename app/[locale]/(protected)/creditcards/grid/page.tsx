'use client';

import React, { useEffect, useState } from 'react'
import { getCreditCards, CreditCard } from '../data'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    avatarComponents, IconType
} from "@/components/pwicons/pwicons";
import EmptyProject from './components/empty';
import ProjectAction from './components/project-action';

const CreditCardGrid = () => {
    // const projects = await getProjects();    

    const [creditcards, setCreditCards] = useState<CreditCard[]>([]);  // Inicializa o estado como um array vazio

    useEffect(() => {
        const fetchCreditCards = async () => {
            const data:CreditCard[] = await getCreditCards();
            setCreditCards(data);
        };

        fetchCreditCards();
    }, []);


    if (creditcards.length === 0) return <EmptyProject />

    return (
        <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5'>
            {creditcards?.map(({ avatar, title, diavenc, diafech, progress, limite }, index) => {
                const IconComponent = avatarComponents[avatar as IconType];
                return (
                    <Card key={index}>
                        <CardHeader className="flex-row gap-1  items-center space-y-0">
                            <div className="flex-1 flex items-center gap-4">
                                {IconComponent ? (
                                    <Avatar className="flex-none h-10 w-10 rounded">
                                        <IconComponent fontSize="41px" />
                                    </Avatar>
                                ) : (
                                    <div>Error: Icon not found</div>
                                )}
                                <h3 className="text-default-900 text-lg font-medium max-w-[210px] truncate text-center capitalize ">{title}</h3>
                            </div>
                            <ProjectAction />
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 mt-0">
                                <div>
                                    <div className="text-xs text-default-400 mb-1">Vencimento</div>
                                    <div className="text-xs text-default-600  font-medium">{diavenc}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-default-400 mb-1">Fechamento</div>
                                    <div className="text-xs text-default-600  font-medium">{diafech}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-default-400 mb-1">Limite</div>
                                    <div className="text-xs text-default-600  font-medium">R$ {limite}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-default-400 mb-1">Disponível</div>
                                    <div className="text-xs text-default-600  font-medium">R$ 500,00</div>
                                </div>
                            </div>
                            <div className="mt-1">
                                <div className="text-end text-xs text-default-600 mb-1.5 font-medium">Usado {progress}%</div>
                                <Progress value={progress} color="primary" size="sm" />
                            </div>
                        </CardContent>
                    </Card>
                )
            })}

        </div>
    )
}

export default CreditCardGrid