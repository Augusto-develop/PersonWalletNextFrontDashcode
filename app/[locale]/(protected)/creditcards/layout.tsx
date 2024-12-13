import { Metadata } from "next";
import CreditCardWrapper from "./creditcard-wrapper";
import React from "react";
export const metadata: Metadata = {
  title: 'Cartão de Crédito',
  description: 'Cartão de Crédito Page'
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CreditCardWrapper>
      {children}
    </CreditCardWrapper>
  );
};

export default Layout;