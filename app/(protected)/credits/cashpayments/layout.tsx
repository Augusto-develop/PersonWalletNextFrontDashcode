import { Metadata } from "next";
import CashPaymentWrapper from "./components/cashpayment-wrapper";
import React from "react";
import { CashPaymentProvider } from './components/cashpayment-context'; // Import the context provider
export const metadata: Metadata = {
  title: 'Cartão de Crédito',
  description: 'Cartão de Crédito Page'
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CashPaymentProvider>
      <CashPaymentWrapper>
        {children}
      </CashPaymentWrapper>
    </CashPaymentProvider>
  );
};

export default Layout;