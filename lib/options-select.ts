import { addLeadingZeros } from "@/lib/utils";

export interface Option {
    value: string;
    label: string;
}

export const dayOptions: Option[] = Array.from({ length: 31 }, (_, i) => ({
    value: addLeadingZeros(`${i + 1}`, 2),
    label: addLeadingZeros(`${i + 1}`, 2),
}));

export const bandeiraOptions: Option[] = [
    { value: "VISA", label: "Visa" },
    { value: "MASTERCARD", label: "Mastercard" },
];

export const emissorOptions: Option[] = [
    { value: "ATACADAO", label: "Atacadão" },
    { value: "BANCOBRASIL", label: "Banco do Brasil" },
    { value: "BRADESCO", label: "Bradesco" },
    { value: "BRASILCARD", label: "BrasilCard" },
    { value: "CAIXA", label: "Caixa" },
    { value: "ITAU", label: "Itau" },
    { value: "MERCADOPAGO", label: "Mercado Pago" },
    { value: "NEON", label: "Neon" },
    { value: "NOVUCARD", label: "NovuCard" },
    { value: "NUBANK", label: "Nubank" },
    { value: "OUZE", label: "Ouze" },
    { value: "RIACHUELO", label: "Riachuelo" },
    { value: "SANTANDER", label: "Santander" },
];