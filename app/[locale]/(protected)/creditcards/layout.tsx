import { Metadata } from "next";
import CreditCardWrapper from "./creditcard-wrapper";
import React from "react";
import { CreditCardProvider } from './creditcard-context'; // Import the context provider
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