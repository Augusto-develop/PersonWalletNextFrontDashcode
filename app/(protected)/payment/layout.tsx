import { Metadata } from "next";
import PaymentWrapper from "./components/payment-wrapper";
import React from "react";
import { PaymentProvider } from './components/payment-context'; // Import the context provider
export const metadata: Metadata = {
  title: 'Payments',
  description: 'Payment Page'
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PaymentProvider>
      <PaymentWrapper>
        {children}
      </PaymentWrapper>
    </PaymentProvider>
  );
};

export default Layout;