'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

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

export type InputsFilter = {
  creditcard: string;
  mes: string;
  ano: string;
  isSubmit: boolean;
  isRecurring: boolean;
}

interface ExpenseContextType {
  filter: InputsFilter;
  setFilter: React.Dispatch<React.SetStateAction<InputsFilter>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  deleteExpense: (id: string) => void;
  editExpense: (id: string, updatedData: Partial<Expense>) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenseContext must be used within a ExpenseProvider');
  }
  return context;
};

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider = ({ children }: ExpenseProviderProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<InputsFilter>({
    creditcard: '',
    mes: '',
    ano: '',
    isSubmit: false,
    isRecurring: false
  });

  // Delete a credit card by its ID
  const deleteExpense = (id: string) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
  };

  const editExpense = (id: string, updatedData: Partial<Expense>) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedData } : expense
      )
    );
  };

  return (
    <ExpenseContext.Provider value={{ expenses, setExpenses, deleteExpense, editExpense, filter, setFilter }}>
      {children}
    </ExpenseContext.Provider>
  );
};
