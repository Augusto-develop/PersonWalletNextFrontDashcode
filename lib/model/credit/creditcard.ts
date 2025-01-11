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
    disponivel: string;
    maxPixCredito: string;
};

export interface CreditCardOption extends CreditOption {};