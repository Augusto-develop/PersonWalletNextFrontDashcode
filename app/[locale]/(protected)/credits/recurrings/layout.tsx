import { Metadata } from "next";
import RecurringWrapper from "./components/recurring-wrapper";
import React from "react";
import { RecurringProvider } from './components/recurring-context'; // Import the context provider
export const metadata: Metadata = {
  title: 'Cartão de Crédito',
  description: 'Cartão de Crédito Page'
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecurringProvider>
      <RecurringWrapper>
        {children}
      </RecurringWrapper>
    </RecurringProvider>
  );
};

export default Layout;