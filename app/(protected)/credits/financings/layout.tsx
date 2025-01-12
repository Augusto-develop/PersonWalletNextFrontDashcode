import { Metadata } from "next";
import FinancingWrapper from "./components/financing-wrapper";
import React from "react";
import { FinancingProvider } from './components/financing-context'; // Import the context provider
export const metadata: Metadata = {
  title: 'Cartão de Crédito',
  description: 'Cartão de Crédito Page'
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <FinancingProvider>
      <FinancingWrapper>
        {children}
      </FinancingWrapper>
    </FinancingProvider>
  );
};

export default Layout;