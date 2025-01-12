import { Metadata } from "next";
import CategoryWrapper from "./components/category-wrapper";
import React from "react";
import { CategoryProvider } from './components/category-context'; // Import the context provider
export const metadata: Metadata = {
  title: 'Categories',
  description: 'Category Page'
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CategoryProvider>
      <CategoryWrapper>
        {children}
      </CategoryWrapper>
    </CategoryProvider>
  );
};

export default Layout;