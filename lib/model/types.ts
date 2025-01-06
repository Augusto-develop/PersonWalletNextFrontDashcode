
import { Emissor, Bandeira } from "@/lib/model/enums";

export * from "./credit";
export * from "./category";
export * from "./expense";
export * from "./wallet";
export * from "./payment";
export * from "./revenue";
export * from "./movement";

export interface Option { 
    value: string;
    label: string;
}

export type IconAvatar = {
    text: string;
    avatar: string;
}

export type IconType =
    | Emissor.SANTANDER
    | Emissor.CAIXA
    | Emissor.NUBANK
    | Emissor.MERCADOPAGO
    | Emissor.ATACADAO
    | Emissor.NOVUCARD
    | Emissor.OUZE
    | Emissor.RIACHUELO
    | Emissor.BRASILCARD
    | Emissor.NEON
    | Bandeira.VISA
    | Bandeira.MASTERCARD
    | Emissor.BRADESCO
    | Emissor.ITAU
    | Emissor.BANCOBRASIL
    | Emissor.C6BANK
    | Emissor.MIDWAY
    | Emissor.BANCOPAN;