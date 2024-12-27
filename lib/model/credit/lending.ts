import { CreditOption, IconAvatar } from "../types";

export interface LendingOption extends CreditOption { };

export type Lending = {
    id: string;
    descricao: IconAvatar;
    diavenc: string;
    valorcredito: string;
};