'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Wallet } from "@/lib/model/types";

interface WalletContextType {
  wallets: Wallet[];
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>;
  deleteWallet: (id: string) => void;
  editWallet: (id: string, updatedData: Partial<Wallet>) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  // Delete a credit card by its ID
  const deleteWallet = (id: string) => {
    setWallets((prevWallets) => prevWallets.filter((wallet) => wallet.id !== id));
  };

  // Edit a credit card's details by its ID
  const editWallet = (id: string, updatedData: Partial<Wallet>) => {
    setWallets((prevWallets) =>
      prevWallets.map((wallet) =>
        wallet.id === id ? { ...wallet, ...updatedData } : wallet
      )
    );
  };

  return (
    <WalletContext.Provider value={{ wallets, setWallets, deleteWallet, editWallet  }}>
      {children}
    </WalletContext.Provider>
  );
};
