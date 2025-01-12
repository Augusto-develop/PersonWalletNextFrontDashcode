'use client';

import React, { useEffect, useState } from 'react'
import { getCreditCards } from '@/action/creditcard-actions'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    avatarComponents
} from "@/components/pwicons/pwicons";
import EmptyProject from './components/empty';
import CreditCardAction from './components/creditcard-action';
import { useCreditCardContext } from './components/creditcard-context';
import { convertFloatToMoeda } from '@/lib/utils';
import { CreditCard, IconType } from "@/lib/model/types";

const CreditCardGrid = () => {

    const { creditcards, setCreditCards } = useCreditCardContext();  // Access context state and setter

    useEffect(() => {
        const fetchCreditCards = async () => {
            const data: CreditCard[] = await getCreditCards();
            setCreditCards(data);
        };

        fetchCreditCards();
    }, [setCreditCards]);


    if (creditcards.length === 0) return <EmptyProject />

    return (
        <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5'>
            {creditcards?.map(({ avatar, title, diavenc, diafech, progress, limite, disponivel, id, emissor,
                bandeira, maxPixCredito }, index) => {
                const IconComponent = avatarComponents[avatar as IconType];
                const IconComponentBandeira = avatarComponents[bandeira as IconType];
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
                            <CreditCardAction creditCard={{
                                avatar, title, diavenc, diafech,
                                progress, limite, disponivel, id, emissor, bandeira, maxPixCredito
                            }} />
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 mt-0">
                                <div>
                                    <div className="text-xs text-default-400 mb-1">Fechamento</div>
                                    <div className="text-xs text-default-600  font-medium">{diafech}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-default-400 mb-1">Vencimento</div>
                                    <div className="text-xs text-default-600  font-medium">{diavenc}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-default-400 mb-1">Limite</div>
                                    <div className="text-xs text-default-600  font-medium">{convertFloatToMoeda(limite)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-default-400 mb-1">Disponível</div>
                                    <div className="text-xs text-default-pw-700  font-medium">{convertFloatToMoeda(disponivel)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-default-400 mb-1">RecargaPay</div>
                                    <div className="text-xs text-default-pw-700  font-medium">{convertFloatToMoeda(maxPixCredito)}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-5">
                                <div className="col-span-3 py-3">
                                    <div className="text-end text-xs text-default-600 mb-1.5 font-medium">Usado {progress}%</div>
                                    <Progress value={progress} color="primary" size="sm" />
                                </div>
                                <div className="col-span-1 p-4">
                                    <div className="flex-1 flex items-center gap-4">
                                        {IconComponentBandeira ? (
                                            <Avatar className="flex-none h-7 w-14 rounded" onMouseOver={undefined}>
                                                <IconComponentBandeira fontSize="29px" />
                                            </Avatar>
                                        ) : (
                                            <div>Error: Icon not found</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}

        </div>
    )
}

export default CreditCardGrid