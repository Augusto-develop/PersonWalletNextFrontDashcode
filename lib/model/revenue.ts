import { DayJsObject } from "@/components/mui-datepicker";

export type Revenue = {
  id: string;
  descricao: string; 
  carteiraId: string; 
  diareceb: string;
  valor: string;
  categoriaId: string;
};

export type InputsFilterRevenue = { 
  mes: string;
  ano: string;
  competencia: DayJsObject | undefined;
  isSubmit: boolean;  
} 

export type RevenueGroupCategory = {  
  categoriaDescricao: string;   
  total: string;  
};

