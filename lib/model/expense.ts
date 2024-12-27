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
    creditcard: string;
    mes: string;
    ano: string;
    isSubmit: boolean;
    isRecurring: boolean;
    isCashPayment: boolean;
  }