'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Expense, InputsFilterExpense, CreditOption } from "@/lib/model/types";

interface ExpenseContextType {
  filter: InputsFilterExpense;
  setFilter: React.Dispatch<React.SetStateAction<InputsFilterExpense>>;
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
  const [filter, setFilter] = useState<InputsFilterExpense>({
    credit: undefined,
    mes: '',
    ano: '',
    isSubmit: false   
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
