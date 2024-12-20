import { Metadata } from "next";
import ExpenseWrapper from "./components/expense-wrapper";
import React from "react";
import { ExpenseProvider } from './components/expense-context'; // Import the context provider
export const metadata: Metadata = {
  title: 'Expenses',
  description: 'Expense Page'
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ExpenseProvider>
      <ExpenseWrapper>
        {children}
      </ExpenseWrapper>
    </ExpenseProvider>
  );
};

export default Layout;