import { TypeCredit } from "./enums";

export * from "./credit/creditcard";
export * from "./credit/financing";
export * from "./credit/lending";
export * from "./credit/recurring";
export * from "./credit/cashpayment";

export type CreditOption = {
    label: string;
    value: string;
    avatar: string;
    type: TypeCredit;
    error?: string;
};

export interface GroupedCreditOption {
    label: string;
    options: CreditOption[];
}