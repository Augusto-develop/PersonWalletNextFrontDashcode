'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ExpensesForPayment, InputsFilterPayment, Invoice, Movement, WalletOption } from "@/lib/model/types";
import { calcTotalsExpenses, createPaymentStatus } from '@/action/payment-actions';

interface PaymentContextType {
  filter: InputsFilterPayment;
  setFilter: React.Dispatch<React.SetStateAction<InputsFilterPayment>>;
  expensesForPayment: ExpensesForPayment;
  setExpensesForPayment: React.Dispatch<React.SetStateAction<ExpensesForPayment>>;
  walletOptions: WalletOption[];
  setWalletOptions: React.Dispatch<React.SetStateAction<WalletOption[]>>;
  editExpensesForPayment: (id: string, updatedData: Partial<Invoice>) => void;
  editPaymentInInvoice: (id: string, paymentId: string, updatedData: Partial<Invoice>) => void;
  deletePaymentInInvoice: (invoiceId: string, paymentId: string) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider = ({ children }: PaymentProviderProps) => {
  // Initializing ExpensesForPayment with valid default values
  const [expensesForPayment, setExpensesForPayment] = useState<ExpensesForPayment>({
    invoices: [],
    totalsExpenses: {
      total1Quinze: 0,
      total1QuinzePago: 0,
      total2Quinze: 0,
      total2QuinzePago: 0,
    },
    totalsRevenues: {
      total1Quinze: 0,
      total1QuinzeDiff: 0,
      total2Quinze: 0,
      total2QuinzeDiff: 0
    }
  });

  // Initializing filter state
  const [filter, setFilter] = useState<InputsFilterPayment>({
    mes: '',
    ano: '',
    competencia: undefined,
    isSubmit: false,
  });

  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);

  // Correctly updating an invoice by ID
  const editExpensesForPayment = (id: string, updatedData: Partial<Invoice>) => {
    setExpensesForPayment((prevState) => {
      // Atualiza a fatura com os dados alterados
      const updatedInvoices = prevState.invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, ...updatedData } : invoice
      );
      const newTotalsExpenses = calcTotalsExpenses(updatedInvoices);
      return {
        ...prevState,
        invoices: updatedInvoices,
        totalsExpenses: newTotalsExpenses,
      };
    });
  };

  const editPaymentInInvoice = (invoiceId: string, paymentId: string, updatedData: Partial<Movement>) => {
    setExpensesForPayment((prevState) => ({
      ...prevState,
      invoices: prevState.invoices.map((invoice) =>
        invoice.id === invoiceId
          ? {
            ...invoice,
            pagamentos: invoice.pagamentos?.map((payment) =>
              payment.id === paymentId ? { ...payment, ...updatedData } : payment
            ),
          }
          : invoice
      ),
    }));
  };

  const deletePaymentInInvoice = (invoiceId: string, paymentId: string) => {
    setExpensesForPayment((prevState) => {
      // Mapeia as faturas
      const updatedInvoices = prevState.invoices.map((invoice) => {
        if (invoice.id === invoiceId) {
          // Filtra os pagamentos apenas uma vez
          const updatedPayments = invoice.pagamentos?.filter((payment) => payment.id !== paymentId);

          // Gera o status de pagamento atualizado
          const paymentStatus = createPaymentStatus(invoice.diavenc, invoice.total, updatedPayments ?? []);

          console.log(paymentStatus);

          // Atualiza a fatura
          return {
            ...invoice,
            pagamentos: updatedPayments,  // Atualiza os pagamentos
            ...paymentStatus,  // Atualiza as informações de status
          };
        }
        return invoice;
      });

      // Recalcula os totais após deletar o pagamento
      const newTotalsExpenses = calcTotalsExpenses(updatedInvoices);

      return {
        ...prevState,
        invoices: updatedInvoices,
        totalsExpenses: newTotalsExpenses,  // Atualiza os totais de despesas
      };
    });
  };


  return (
    <PaymentContext.Provider value={{
      expensesForPayment, setExpensesForPayment, editExpensesForPayment,
      filter, setFilter,
      walletOptions, setWalletOptions, editPaymentInInvoice, deletePaymentInInvoice
    }}>
      {children}
    </PaymentContext.Provider>
  );
};
