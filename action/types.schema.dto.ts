
export interface CreditDto {
    id?: string;
    descricao: string;
    type: string;
    diavenc: string;
    valorcredito: number;
    emissor: string;
};

export interface CreditCardDto extends CreditDto {        
    diafech: string;    
    bandeira: string;
};

export interface FinancingDto extends CreditDto {  
    valorparcela: number;
    qtdeparcela: number;   
};

export interface LendingDto extends FinancingDto {    
    
};