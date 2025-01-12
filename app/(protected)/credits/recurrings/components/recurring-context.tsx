'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Recurring } from "@/lib/model/types";


interface RecurringContextType {
  recurrings: Recurring[];
  setRecurrings: React.Dispatch<React.SetStateAction<Recurring[]>>;
  deleteRecurring: (id: string) => void;
  editRecurring: (id: string, updatedData: Partial<Recurring>) => void;
}

const RecurringContext = createContext<RecurringContextType | undefined>(undefined);

export const useRecurringContext = () => {
  const context = useContext(RecurringContext);
  if (!context) {
    throw new Error('useRecurringContext must be used within a RecurringProvider');
  }
  return context;
};

interface RecurringProviderProps {
  children: ReactNode;
}

export const RecurringProvider = ({ children }: RecurringProviderProps) => {
  const [recurrings, setRecurrings] = useState<Recurring[]>([]);

  // Delete a credit card by its ID
  const deleteRecurring = (id: string) => {
    setRecurrings((prevRecurrings) => prevRecurrings.filter((card) => card.id !== id));
  };

  // Edit a credit card's details by its ID
  const editRecurring = (id: string, updatedData: Partial<Recurring>) => {
    setRecurrings((prevRecurrings) =>
      prevRecurrings.map((card) =>
        card.id === id ? { ...card, ...updatedData } : card
      )
    );
  };

  return (
    <RecurringContext.Provider value={{ recurrings, setRecurrings, deleteRecurring, editRecurring }}>
      {children}
    </RecurringContext.Provider>
  );
};
