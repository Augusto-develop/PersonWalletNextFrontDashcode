import { Metadata } from "next";
import LendingWrapper from "./components/lending-wrapper";
import React from "react";
import { LendingProvider } from './components/lending-context'; // Import the context provider
export const metadata: Metadata = {
  title: 'Cartão de Crédito',
  description: 'Cartão de Crédito Page'
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LendingProvider>
      <LendingWrapper>
        {children}
      </LendingWrapper>
    </LendingProvider>
  );
};

export default Layout;