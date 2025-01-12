"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload } from "lucide-react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import React from "react";
import { ExpenseDto } from "@/action/types.schema.dto";
import { createExpense } from "@/action/expense-actions";
import Card from "@/components/code-snippet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Transaction {
  date: string;
  description: string;
  value: number;
}

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  creditId: string,
  mesfat: string,
  anofat: string,
}

const ReaderInvoice = ({ open, setOpen, creditId, mesfat, anofat }: CreateTaskProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "text/csv": [".csv"], // Aceita arquivos CSV
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        parseCSV(file);
      }
    },
  });

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const rows = text.split("\n").slice(1); // Ignora a primeira linha (cabeçalho)
      const parsedData: Transaction[] = rows
        .map((row) => {
          const [date, description, value] = row.split(",");

          const dateValid = new Date(date);
          const isValidDate = !isNaN(dateValid.getTime());

          if (isValidDate && description && !isNaN(parseFloat(value))) {
            return {
              date: dateValid.toISOString(),
              description: description.trim(),
              value: parseFloat(value),
            };
          }

          return null;
        })
        .filter((entry): entry is Transaction => entry !== null); // Remove nulos e ajusta o tipo

      setTransactions(parsedData); // This updates the state asynchronously
    };
    reader.readAsText(file);
  };

  const closeTheFile = () => {
    setTransactions([]);
  };

  const handleCreateExpense = () => {
    if (transactions.length) {
      transactions.forEach((transaction) => {

        const date = new Date(transaction.date);
        const isValidDate = !isNaN(date.getTime()); // Verifica se a data é válida

        let payload: ExpenseDto = {
          creditId: creditId,
          descricao: transaction.description,
          categoriaId: "d81075f2-c8a3-4ae0-8881-2fc15dcdb726",
          anofat: anofat,
          mesfat: mesfat,
          numparc: 1,
          qtdeparc: 1,
          lancamento: isValidDate ? date.toISOString() : new Date().toISOString(),
          valor: transaction.value.toFixed(2),
          generateparc: false,
        };

        createExpense(payload);
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reader Invoice</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <Card title="" code="">
              <div className={transactions.length ? "h-[300px] w-full" : ""}>
                {transactions.length ? (
                  <div className="w-full h-full relative">
                    <Button
                      type="button"
                      className="absolute top-4 right-4 h-12 w-12 rounded-full bg-default-900 hover:bg-background hover:text-default-900 z-20"
                      onClick={closeTheFile}
                    >
                      <span className="text-xl">
                        <Icon icon="fa6-solid:xmark" />
                      </span>
                    </Button>
                    <Button onClick={handleCreateExpense}>Create Expenses</Button>
                    <div className="p-4 space-y-2">
                      <span>{transactions.length} Registros</span>
                      {/* {transactions.map((transaction, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{transaction.date}</span>
                          <span>{transaction.description}</span>
                          <span>{transaction.value.toFixed(2)}</span>
                        </div>
                      ))} */}
                    </div>
                  </div>
                ) : (
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <div className="w-full text-center border-dashed border border-default-200 dark:border-default-300 rounded-md py-[52px] flex items-center flex-col">
                      <CloudUpload className="text-default-300 w-10 h-10" />
                      <h4 className="text-2xl font-medium mb-1 mt-3 text-card-foreground/80">
                        Drop CSV file here or click to upload.
                      </h4>
                      <div className="text-xs text-muted-foreground">
                        (This is just a demo drop zone. The selected CSV will be parsed and displayed.)
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog >
  );
};

export default ReaderInvoice;
