'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Descricao = {
  text: string;
  avatar: string;
}

export type Lending = {
  id: string;
  descricao: Descricao; 
  diavenc: string;
  valorcredito: string;  
};

interface LendingContextType {
  lendings: Lending[];
  setLendings: React.Dispatch<React.SetStateAction<Lending[]>>;
  deleteLending: (id: string) => void;
  editLending: (id: string, updatedData: Partial<Lending>) => void;
}

const LendingContext = createContext<LendingContextType | undefined>(undefined);

export const useLendingContext = () => {
  const context = useContext(LendingContext);
  if (!context) {
    throw new Error('useLendingContext must be used within a LendingProvider');
  }
  return context;
};

interface LendingProviderProps {
  children: ReactNode;
}

export const LendingProvider = ({ children }: LendingProviderProps) => {
  const [lendings, setLendings] = useState<Lending[]>([]);

  // Delete a credit card by its ID
  const deleteLending = (id: string) => {
    setLendings((prevLendings) => prevLendings.filter((card) => card.id !== id));
  };

  // Edit a credit card's details by its ID
  const editLending = (id: string, updatedData: Partial<Lending>) => {
    setLendings((prevLendings) =>
      prevLendings.map((card) =>
        card.id === id ? { ...card, ...updatedData } : card
      )
    );
  };

  return (
    <LendingContext.Provider value={{ lendings, setLendings, deleteLending, editLending }}>
      {children}
    </LendingContext.Provider>
  );
};
