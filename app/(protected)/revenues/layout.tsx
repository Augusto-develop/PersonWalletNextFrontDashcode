import { Metadata } from "next";
import RevenueWrapper from "./components/revenue-wrapper";
import React from "react";
import { RevenueProvider } from './components/revenue-context'; // Import the context provider
export const metadata: Metadata = {
  title: 'Revenues',
  description: 'Revenue Page'
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RevenueProvider>
      <RevenueWrapper>
        {children}
      </RevenueWrapper>
    </RevenueProvider>
  );
};

export default Layout;