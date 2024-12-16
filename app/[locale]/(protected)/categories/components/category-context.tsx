'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Category = {
  id: string;
  description: string;   
};

interface CategoryContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  deleteCategory: (id: string) => void;
  editCategory: (id: string, updatedData: Partial<Category>) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider = ({ children }: CategoryProviderProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  // Delete a credit card by its ID
  const deleteCategory = (id: string) => {
    setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
  };

  // Edit a credit card's details by its ID
  const editCategory = (id: string, updatedData: Partial<Category>) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === id ? { ...category, ...updatedData } : category
      )
    );
  };

  return (
    <CategoryContext.Provider value={{ categories, setCategories, deleteCategory, editCategory  }}>
      {children}
    </CategoryContext.Provider>
  );
};
