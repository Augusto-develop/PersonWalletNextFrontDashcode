
export interface CreditDto {
    id?: string;
    descricao: string;
    type: string;
    diavenc: string;
    valorcredito: number | string;    
};

export interface CreditCardDto extends CreditDto {  
    emissor: string;      
    diafech: string;    
    bandeira: string;
};

export interface RecurringDto extends CreditDto {        
    
};

export interface FinancingDto extends CreditDto {  
    emissor: string;    
};

export interface LendingDto extends FinancingDto {    
    
};

