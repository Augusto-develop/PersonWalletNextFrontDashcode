'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CashPayment } from "@/lib/model/types";

interface CashPaymentContextType {
  cashpayments: CashPayment[];
  setCashPayments: React.Dispatch<React.SetStateAction<CashPayment[]>>;
  deleteCashPayment: (id: string) => void;
  editCashPayment: (id: string, updatedData: Partial<CashPayment>) => void;
}

const CashPaymentContext = createContext<CashPaymentContextType | undefined>(undefined);

export const useCashPaymentContext = () => {
  const context = useContext(CashPaymentContext);
  if (!context) {
    throw new Error('useCashPaymentContext must be used within a CashPaymentProvider');
  }
  return context;
};

interface CashPaymentProviderProps {
  children: ReactNode;
}

export const CashPaymentProvider = ({ children }: CashPaymentProviderProps) => {
  const [cashpayments, setCashPayments] = useState<CashPayment[]>([]);

  // Delete a credit card by its ID
  const deleteCashPayment = (id: string) => {
    setCashPayments((prevCashPayments) => prevCashPayments.filter((card) => card.id !== id));
  };

  // Edit a credit card's details by its ID
  const editCashPayment = (id: string, updatedData: Partial<CashPayment>) => {
    setCashPayments((prevCashPayments) =>
      prevCashPayments.map((card) =>
        card.id === id ? { ...card, ...updatedData } : card
      )
    );
  };

  return (
    <CashPaymentContext.Provider value={{ cashpayments, setCashPayments, deleteCashPayment, editCashPayment }}>
      {children}
    </CashPaymentContext.Provider>
  );
};
