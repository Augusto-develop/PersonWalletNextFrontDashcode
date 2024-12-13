"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import Select, { MultiValue } from 'react-select'
import { CleaveInput } from "@/components/ui/cleave";



function convertToNumeric(value) {
  if (!value) return null;

  // Remove "R$", espaços e pontos
  let numericValue = value.replace(/R\$|\s|\./g, "");

  // Substitui a vírgula decimal por um ponto
  numericValue = numericValue.replace(",", ".");

  // Converte para número de ponto flutuante
  return parseFloat(numericValue);
}

function addLeadingZeros(value, length) {
  return value.toString().padStart(length, "0");
}

const submitCreate = async (data) => {
  // Prepara o payload
  const payload = {
    descricao: data.descricao,
    valorcredito: convertToNumeric(data.limite),
    type: "CARTAO",
    emissor: data.emissor.value,
    bandeira: data.bandeira.value,
    diavenc: addLeadingZeros(data.vencimento.value, 2),
    diafech: addLeadingZeros(data.fechamento.value, 2),
  };

  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NjVkYTBhZC1lNDFiLTQ0Y2ItODJiYS0wNjc5OTdkNGI4NWUiLCJ1c2VybmFtZSI6IkF1Z3VzdG8gZGUgQ2FzdHJvIEdvbWVzIiwiaWF0IjoxNzM0MDU2OTEwLCJleHAiOjE3MzQwNjA1MTB9.IaCNYYCHpAxMJoxKqU4qjyotu_iq-Rn3rklhyYLHd0A";

    const response = await fetch('http://localhost:3000/credito', {
      method: "POST",
      headers: {        
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Sucesso:", result);
    } else {
      console.error("Erro ao enviar:", response.statusText);
    }
  } catch (error) {
    console.error("Erro de requisição:", error);
  }
};


interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Option {
  value: string;
  label: string;
  image?: string;
}

type Inputs = {
  descricao: string;
  vencimento: Option;
  fechamento: Option;
  bandeira: Option;
  emissor: Option;
  limite: string;
}

const options: Option[] = [
  {
    value: "team",
    label: "team",
  },
  {
    value: "low",
    label: "low",
  },
  {
    value: "medium",
    label: "medium",
  },
  {
    value: "high",
    label: "high",
  },
  {
    value: "update",
    label: "update",
  }
];

const assigneeOptions: Option[] = [
  { value: "mahedi", label: "Mahedi Amin", image: "/images/avatar/av-1.svg" },
  { value: "sovo", label: "Sovo Haldar", image: "/images/avatar/av-2.svg" },
  { value: "rakibul", label: "Rakibul Islam", image: "/images/avatar/av-3.svg" },
  { value: "pritom", label: "Pritom Miha", image: "/images/avatar/av-4.svg" },
];

const dayOptions: Option[] = Array.from({ length: 31 }, (_, i) => ({
  value: `${i + 1}`,
  label: `${i + 1}`,
}));

const bandeiraOptions: Option[] = [
  { value: "VISA", label: "Visa" },
  { value: "MASTERCARD", label: "Mastercard" },
];

const emissorOptions: Option[] = [
  { value: "NEON", label: "Neon" },
  { value: "RIACHUELO", label: "Riachuelo" },
  { value: "NUBANK", label: "Nubank" },
  { value: "SANTANDER", label: "Santander" },
];

const CreateCreditCard = ({ open, setOpen }: CreateTaskProps) => {  

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    submitCreate(data);
    //setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Credit Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              placeholder="Descrição do Cartão"
              {...register("descricao", { required: "Descrição is required." })}
              color={errors.descricao ? "destructive" : "default"}
            />
            {errors.descricao && <p className="text-destructive  text-sm font-medium">{errors.descricao.message}</p>}
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div className="space-y-1">
              <Label htmlFor="emissor">Emissor</Label>
              <Controller
                name="emissor"
                control={control}
                rules={{ required: "Emissor is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      className="react-select"
                      classNamePrefix="select"
                      options={emissorOptions}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bandeira">Bandeira</Label>
              <Controller
                name="bandeira"
                control={control}
                rules={{ required: "Bandeira is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      className="react-select"
                      classNamePrefix="select"
                      options={bandeiraOptions}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div className="space-y-1">
              <Label htmlFor="vencimento">Vencimento</Label>
              <Controller
                name="vencimento"
                control={control}
                rules={{ required: "Vencimento is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      className="react-select"
                      classNamePrefix="select"
                      options={dayOptions}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fechamento">Fechamento</Label>
              <Controller
                name="fechamento"
                control={control}
                rules={{ required: "Fechamento is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      className="react-select"
                      classNamePrefix="select"
                      options={dayOptions}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="limite">Limite</Label>
            <CleaveInput
              id="limite"
              options={{
                numeral: true,
                numeralThousandsGroupStyle: "thousand",
                numeralDecimalMark: ",",
                delimiter: ".",
                prefix: "R$ ",
                numeralDecimalScale: 2,
                numeralIntegerScale: 15, // Máximo de dígitos antes do decimal
                numeralPositiveOnly: true, // Apenas valores positivos
              }}
              placeholder=""
              {...register("limite", {
                required: "Limite is required.",
                validate: (value) => value !== "R$ " || "Por favor, insira um valor válido."
              })}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Add</Button>
          </div>
        </form>

      </DialogContent>
    </Dialog >
  );
};

export default CreateCreditCard;
