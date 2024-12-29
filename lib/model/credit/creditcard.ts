import { CreditOption } from "../types";

export type CreditCard = {
    id: string;
    title: string;
    avatar: string;
    diavenc: string;
    diafech: string;
    limite: string;
    progress: number;
    emissor: string;
    bandeira: string;
};

export type Invoice = {
    id: string;
    title: string;
    avatar: string;
    diavenc: string;
    diafech: string;       
    emissor: string;  
    total: string;
    columnId: string;
};

export interface CreditCardOption extends CreditOption {};