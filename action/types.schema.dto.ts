
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
    limite?: string;
};

export interface InvoiceDto extends CreditCardDto {
    totalFatura: string;
    despesas: ExpenseDto[];
    movimentos: MovementDto[];
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
    categoriaId: string;
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
    generateparc: boolean;
    parentId?: string;
    carteiraPg?: string;
};

export type ExpenseInvoiceSumDto = {
    current: number | string;
    previous: number | string;
    next: number | string;
    future: number | string;
};

export type WalletDto = {
    id?: string;
    descricao: string;
    emissor: string;
    ativo: boolean;
};

export type WalletSaldoDto = {
    id?: string;
    descricao: string;
    emissor: string;
    saldo: number | string;
};

export type RevenueDto = {
    id?: string;
    carteiraId: string;
    descricao: string;
    datareceb: string;
    valor: number | string;
    categoriaId: string;
};

export type RevenueGroupCategoryDto = {  
    categoriaDescricao: string;   
    total: string;  
  };

export type MovementDto = {
    id?: string;
    cartdebito: string;
    cartcredito?: string;
    ocorrencia: string;
    valor: number | string;
    creditId?: string;
    anofat?: string;
    mesfat?: string;
};