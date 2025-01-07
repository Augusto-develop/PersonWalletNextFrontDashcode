import { DayJsObject } from "@/components/mui-datepicker";
import { Movement } from "./movement";
import { WalletSaldo } from "./wallet";

export type Invoice = {
    id: string;
    title: string;
    avatar: string;
    diavenc: string;
    diafech: string;
    emissor: string;
    status: StatusInvoice;
    total: string;
    pago: string;
    saldo: string;
    columnId: string;
    columnOrigem: string;
    pagamentos?: Movement[]
};

export const defaultCols = [
    {
        id: "quin1desp",
        title: "Despesas | 1º Quinzena",
        ababgcolor: "text-info",
    },
    {
        id: "quin2desp",
        title: "Despesas | 2º Quinzena",
        ababgcolor: "text-primary",
    },
    {
        id: "despprocess",
        title: "Despesas em Pagamento",
        ababgcolor: "text-warning",
    },
    {
        id: "desppag",
        title: "Despesas Pagas",
        ababgcolor: "text-success",
    },
];

export type Column = (typeof defaultCols)[number];


export type TotalsPaymentExpenses = {
    total1Quinze: number;
    total1QuinzePago: number;
    total2Quinze: number;
    total2QuinzePago: number;
}

export type TotalsPaymentRevenues = {
    total1Quinze: number;
    total1QuinzeDiff: number;
    total2Quinze: number;
    total2QuinzeDiff: number;
}

export type ExpensesForPayment = {
    invoices: Invoice[],
    totalsExpenses: TotalsPaymentExpenses,
    totalsRevenues: TotalsPaymentRevenues,
    saldoCarteiras: WalletSaldo[],
}

export type InputsFilterPayment = {
    mes: string;
    ano: string;
    competencia: DayJsObject | undefined;
    isSubmit: boolean;
}

export type PaymentStatus = {
    totalPagamento: number,
    columnId: string,
    columnOrigem: string,
    status: StatusInvoice,
    saldo: string;
}

export enum StatusInvoice {
    PAGO = "PAGO",
    PAGOMAIOR = "PAGOMAIOR",
    PAGOPARC = "BRADESCO",
    ABERTA = "ABERTA",
    FECHADA = "FECHADA",
    ATRASO = "ATRASO",
}

export const StatusInvoiceText = {
    [StatusInvoice.PAGO]: "Pago",
    [StatusInvoice.PAGOMAIOR]: "Pago a Maior",
    [StatusInvoice.PAGOPARC]: "Pago Parcialmente",
    [StatusInvoice.ABERTA]: "Aberta",
    [StatusInvoice.FECHADA]: "Fechada",
    [StatusInvoice.ATRASO]: "Em Atraso",
};
