
export interface CreditDto {
    id?: string;
    descricao: string;
    type: string;
};

export interface CreditCardDto extends CreditDto {
    diavenc: string;
    valorcredito: number | string;
    emissor: string;
    diafech: string;
    bandeira: string;
};

export interface FinancingDto extends CreditDto {
    diavenc: string;
    valorcredito: number | string;
    emissor: string;
};

export interface LendingDto extends CreditDto {
    diavenc: string;
    valorcredito: number | string;
    emissor: string;
};

export interface RecurringDto extends CreditDto {
    diavenc: string;
    valorcredito: number | string;
};

export interface CashPaymentDto extends CreditDto { };

export type CategoryDto = {
    id?: string;
    descricao: string;
};

export type ExpenseDto = {
    id?: string;
    creditId?: string;
    categoriaId: string;
    anofat: string;
    mesfat: string;
    descricao: string;
    numparc: number;
    qtdeparc: number;
    lancamento: string;
    valor: number | string;
    fixa: boolean;
    generateparc: boolean;
    parentId?: string;
};

export type WalletDto = {
    id?: string;
    descricao: string;
    emissor: string;
    ativo: boolean;
};