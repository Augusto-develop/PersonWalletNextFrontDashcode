export type Invoice = {
    id: string;
    title: string;
    avatar: string;
    diavenc: string;
    diafech: string;
    emissor: string;
    pago: boolean;
    total: string;
    columnId: string;
    columnOrigem: string;
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


export type TotalsPayment = {
    total1Quinze: number;
    total1QuinzePago: number;
    total2Quinze: number;
    total2QuinzePago: number;
}

export type ExpensesForPayment = {
    invoices: Invoice[],
    totals: TotalsPayment
}
