"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { addLeadingZeros, convertToNumeric, convertFloatToMoeda, removePontuacaoValor } from "@/lib/utils";
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
import fetchWithAuth from "@/action/login-actions";
import { Credit, convertToCreditCard } from "@/action/creditcard-actions";
import { CreditCard, useCreditCardContext } from "./creditcard-context";
import CreditCardAction from "./grid/components/creditcard-action";

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataCreditCard?: CreditCard | null
}

interface Option {
  value: string;
  label: string;
}

type Inputs = {
  descricao: string;
  vencimento: Option;
  fechamento: Option;
  bandeira: Option;
  emissor: Option;
  limite: string;
  id?: string;
}

const dayOptions: Option[] = Array.from({ length: 31 }, (_, i) => ({
  value: addLeadingZeros(`${i + 1}`, 2),
  label: addLeadingZeros(`${i + 1}`, 2),
}));

const bandeiraOptions: Option[] = [
  { value: "VISA", label: "Visa" },
  { value: "MASTERCARD", label: "Mastercard" },
];

const emissorOptions: Option[] = [
  { value: "ATACADAO", label: "Atacadão" },
  { value: "BANCOBRASIL", label: "Banco do Brasil" },
  { value: "BRADESCO", label: "Bradesco" },
  { value: "BRASILCARD", label: "BrasilCard" },
  { value: "CAIXA", label: "Caixa" },
  { value: "ITAU", label: "Itau" },
  { value: "MERCADOPAGO", label: "Mercado Pago" },
  { value: "NEON", label: "Neon" },
  { value: "NOVUCARD", label: "NovuCard" },
  { value: "NUBANK", label: "Nubank" },
  { value: "OUZE", label: "Ouze" },
  { value: "RIACHUELO", label: "Riachuelo" },
  { value: "SANTANDER", label: "Santander" },
];

const submitCreate = async (data: {
  descricao: any; vencimento: any; fechamento: any; bandeira: any; emissor: any; limite: any; id?: string | null;
}): Promise<Credit | undefined> => {

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

    console.log(data);

    if (data.id !== null && data.id !== undefined) {
      const response = await fetchWithAuth("/credito/" + data.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newCredit: Credit = await response.json();
        console.log("Sucesso:", newCredit);
        return newCredit;
      } else {
        console.error("Erro ao enviar:", response.statusText);
        return undefined;
      }

    } else {
      const response = await fetchWithAuth("/credito", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newCredit: Credit = await response.json();
        console.log("Sucesso:", newCredit);
        return newCredit;
      } else {
        console.error("Erro ao enviar:", response.statusText);
        return undefined;
      }
    }

  } catch (error) {
    console.error("Erro de requisição:", error);
  }
};

const CreateCreditCard = ({ open, setOpen, dataCreditCard = null }: CreateTaskProps) => {

  const { creditcards, setCreditCards, editCreditCard } = useCreditCardContext();  // Access context state and setter  

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    //editar
    if (dataCreditCard !== null && dataCreditCard !== undefined) {
      data.id = dataCreditCard.id;
      const editCredit: Credit | undefined = await submitCreate(data);
      if (editCredit) {
        const editCard: CreditCard = convertToCreditCard(editCredit);
        editCreditCard(dataCreditCard.id, editCard);
      }
    } else {
      data.id = undefined;
      const newCredit: Credit | undefined = await submitCreate(data);
      if (newCredit) {
        const newCard: CreditCard = convertToCreditCard(newCredit);
        setCreditCards((prevCards) => [...prevCards, newCard]);
      }
    }

    setOpen(false)
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
              defaultValue={dataCreditCard !== null ? dataCreditCard.title : ""}
            />
            {errors.descricao && <p className="text-destructive  text-sm font-medium">{errors.descricao.message}</p>}
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div className="space-y-1">
              <Label htmlFor="emissor">Emissor</Label>
              <Controller
                name="emissor"
                control={control}
                defaultValue={dataCreditCard !== null ?
                  emissorOptions.find((option) => option.value === dataCreditCard.emissor) :
                  undefined}
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
                defaultValue={dataCreditCard !== null ?
                  bandeiraOptions.find((option) => option.value === dataCreditCard.bandeira) :
                  undefined}
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
                defaultValue={dataCreditCard !== null ?
                  dayOptions.find((option) => option.value === dataCreditCard.diavenc) :
                  undefined}
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
                defaultValue={dataCreditCard !== null ?
                  dayOptions.find((option) => option.value === dataCreditCard.diafech) :
                  undefined}
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
              value={dataCreditCard !== null ? convertFloatToMoeda(dataCreditCard.limite) : ""}
              {...register("limite", {
                required: "Limite is required.",
                validate: (value) => value !== "R$ " || "Por favor, insira um valor válido."
              })}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>

      </DialogContent>
    </Dialog >
  );
};

export default CreateCreditCard;
