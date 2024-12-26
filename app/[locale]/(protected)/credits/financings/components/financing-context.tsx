'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Descricao = {
  text: string;
  avatar: string;
}

export type Financing = {
  id: string;
  descricao: Descricao;
  diavenc: string;
  valorcredito: string;  
};

interface FinancingContextType {
  financings: Financing[];
  setFinancings: React.Dispatch<React.SetStateAction<Financing[]>>;
  deleteFinancing: (id: string) => void;
  editFinancing: (id: string, updatedData: Partial<Financing>) => void;
}

const FinancingContext = createContext<FinancingContextType | undefined>(undefined);

export const useFinancingContext = () => {
  const context = useContext(FinancingContext);
  if (!context) {
    throw new Error('useFinancingContext must be used within a FinancingProvider');
  }
  return context;
};

interface FinancingProviderProps {
  children: ReactNode;
}

export const FinancingProvider = ({ children }: FinancingProviderProps) => {
  const [financings, setFinancings] = useState<Financing[]>([]);

  // Delete a credit card by its ID
  const deleteFinancing = (id: string) => {
    setFinancings((prevFinancings) => prevFinancings.filter((card) => card.id !== id));
  };

  // Edit a credit card's details by its ID
  const editFinancing = (id: string, updatedData: Partial<Financing>) => {
    setFinancings((prevFinancings) =>
      prevFinancings.map((card) =>
        card.id === id ? { ...card, ...updatedData } : card
      )
    );
  };

  return (
    <FinancingContext.Provider value={{ financings, setFinancings, deleteFinancing, editFinancing }}>
      {children}
    </FinancingContext.Provider>
  );
};
