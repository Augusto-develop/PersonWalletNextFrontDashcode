import { Metadata } from "next";
import WalletWrapper from "./components/wallet-wrapper";
import React from "react";
import { WalletProvider } from './components/wallet-context'; // Import the context provider
export const metadata: Metadata = {
  title: 'Wallets',
  description: 'Wallet Page'
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletProvider>
      <WalletWrapper>
        {children}
      </WalletWrapper>
    </WalletProvider>
  );
};

export default Layout;