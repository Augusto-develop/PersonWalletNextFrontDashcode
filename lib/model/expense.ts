import { TypeCredit } from "./enums";
import { CreditOption } from "./types";
import { themeCustomMuiDatepicker, DayJsObject } from "@/components/mui-datepicker";

export type Expense = {
  id: string;
  description: string;
  creditId: string;
  categoriaId: string;
  anofat: string;
  mesfat: string;
  numparcela: string;
  qtdeparcela: string;
  viewparcela: string;
  lancamento: string;
  valor: string;
  fixa: boolean;
  isCreateParcelas: boolean;
  isDeleteParcelas: boolean;
  isDelete: boolean;
  isParent: boolean;
};

export type InputsFilterExpense = {
  credit: CreditOption | undefined;
  mes: string;
  ano: string;
  competencia: DayJsObject;
  isSubmit: boolean;  
}    