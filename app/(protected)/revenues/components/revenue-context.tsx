'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Revenue, InputsFilterRevenue, WalletOption, CategoryOption } from "@/lib/model/types";

interface RevenueContextType {
  filter: InputsFilterRevenue;
  setFilter: React.Dispatch<React.SetStateAction<InputsFilterRevenue>>;
  revenues: Revenue[];
  setRevenues: React.Dispatch<React.SetStateAction<Revenue[]>>;
  categoriaOptions: CategoryOption[];
  setCategoriaOptions: React.Dispatch<React.SetStateAction<CategoryOption[]>>;
  walletOptions: WalletOption[];
  setWalletOptions: React.Dispatch<React.SetStateAction<WalletOption[]>>;
  deleteRevenue: (id: string) => void;
  editRevenue: (id: string, updatedData: Partial<Revenue>) => void;
}

const RevenueContext = createContext<RevenueContextType | undefined>(undefined);

export const useRevenueContext = () => {
  const context = useContext(RevenueContext);
  if (!context) {
    throw new Error('useRevenueContext must be used within a RevenueProvider');
  }
  return context;
};

interface RevenueProviderProps {
  children: ReactNode;
}

export const RevenueProvider = ({ children }: RevenueProviderProps) => {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [categoriaOptions, setCategoriaOptions] = useState<CategoryOption[]>([]);
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);
  const [filter, setFilter] = useState<InputsFilterRevenue>({
    mes: '',
    ano: '',
    competencia: undefined,
    isSubmit: false
  });

  // Delete a credit card by its ID
  const deleteRevenue = (id: string) => {
    setRevenues((prevRevenues) => prevRevenues.filter((revenue) => revenue.id !== id));
  };

  const editRevenue = (id: string, updatedData: Partial<Revenue>) => {
    setRevenues((prevRevenues) =>
      prevRevenues.map((revenue) =>
        revenue.id === id ? { ...revenue, ...updatedData } : revenue
      )
    );
  };

  return (
    <RevenueContext.Provider value={{
      revenues,
      setRevenues,
      deleteRevenue,
      editRevenue,
      filter,
      setFilter,
      categoriaOptions,
      setCategoriaOptions,
      walletOptions,
      setWalletOptions
    }}>
      {children}
    </RevenueContext.Provider>
  );
};
