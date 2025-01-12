'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CreditCard } from "@/lib/model/types";

interface CreditCardContextType {
  creditcards: CreditCard[];
  setCreditCards: React.Dispatch<React.SetStateAction<CreditCard[]>>;
  deleteCreditCard: (id: string) => void;
  editCreditCard: (id: string, updatedData: Partial<CreditCard>) => void;
}

const CreditCardContext = createContext<CreditCardContextType | undefined>(undefined);

export const useCreditCardContext = () => {
  const context = useContext(CreditCardContext);
  if (!context) {
    throw new Error('useCreditCardContext must be used within a CreditCardProvider');
  }
  return context;
};

interface CreditCardProviderProps {
  children: ReactNode;
}

export const CreditCardProvider = ({ children }: CreditCardProviderProps) => {
  const [creditcards, setCreditCards] = useState<CreditCard[]>([]);

  // Delete a credit card by its ID
  const deleteCreditCard = (id: string) => {
    setCreditCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  // Edit a credit card's details by its ID
  const editCreditCard = (id: string, updatedData: Partial<CreditCard>) => {
    setCreditCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, ...updatedData } : card
      )
    );
  };

  return (
    <CreditCardContext.Provider value={{ creditcards, setCreditCards, deleteCreditCard, editCreditCard  }}>
      {children}
    </CreditCardContext.Provider>
  );
};
