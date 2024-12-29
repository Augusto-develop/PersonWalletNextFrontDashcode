import { CreditOption } from "../types";

export type Recurring = {
    id: string;
    descricao: string; 
    diavenc: string;
    valorcredito: string;  
    categoriaId: string;  
  };

export interface RecurringOption extends CreditOption { };