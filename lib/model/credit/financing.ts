import { CreditOption, IconAvatar } from "../types";

export type Financing = {
    id: string;
    descricao: IconAvatar;
    diavenc: string;
    valorcredito: string;
};

export interface FinancingOption extends CreditOption {};