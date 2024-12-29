import { CreditOption } from "../types";

export type CashPayment = {
    id: string;
    descricao: string;
};

export interface CashPaymentOption extends CreditOption { }