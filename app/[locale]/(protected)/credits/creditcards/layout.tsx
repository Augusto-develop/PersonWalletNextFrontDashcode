import { Metadata } from "next";
import CreditCardWrapper from "./components/creditcard-wrapper";
import React from "react";
import { CreditCardProvider } from './components/creditcard-context'; // Import the context provider
export const metadata: Metadata = {
  title: 'Cartão de Crédito',
  description: 'Cartão de Crédito Page'
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CreditCardProvider>
      <CreditCardWrapper>
        {children}
      </CreditCardWrapper>
    </CreditCardProvider>
  );
};

export default Layout;