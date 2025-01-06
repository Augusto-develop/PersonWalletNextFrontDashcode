"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import Select from 'react-select'
import { CleaveInput } from "@/components/ui/cleave";
import { convertFloatToMoeda, convertToNumeric, getCurrentDate, convertToAmericanDate } from "@/lib/utils";
import { createOptionsWallets } from "@/action/wallet-actions";
import { WalletOption, IconType, Invoice, Movement, StatusInvoice } from "@/lib/model/types";
import { avatarComponents } from "@/components/pwicons/pwicons";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { MovementDto } from "@/action/types.schema.dto";
import { usePaymentContext } from "./payment-context";
import { convertDtoToMovement, createPayment } from "@/action/movement-actions";
import { createPaymentStatus } from "@/action/payment-actions";

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataInvoice?: Invoice | null
}

type Inputs = {
  carteira: WalletOption;
  datapg: string;
  valor: string;
}

const PayInvoice = ({ open, setOpen, dataInvoice = null }: CreateTaskProps) => {

  const { filter, editExpensesForPayment, walletOptions } = usePaymentContext();

  const submitCreate = async (data: Inputs
  ): Promise<MovementDto[] | []> => {

    const payload: MovementDto = {
      cartdebito: data.carteira.value,
      ocorrencia: new Date(convertToAmericanDate(data.datapg)).toISOString(),
      valor: convertToNumeric(data.valor),
      creditId: dataInvoice?.id,
      anofat: filter.ano,
      mesfat: filter.mes,
    };

    try {
      return createPayment(payload);
    } catch (error) {
      console.error("Erro de requisição:", error);
      return [];
    }
  };

  const {
    handleSubmit,
    control,
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {

    const movementDto: MovementDto[] | [] = await submitCreate(data);

    if (movementDto) {

      const movimentos: Movement[] = movementDto.map(dto => convertDtoToMovement(dto));

      if (dataInvoice) {
        editExpensesForPayment(dataInvoice.id, {
          ...createPaymentStatus(dataInvoice.diavenc, dataInvoice.total, movimentos),
          ...{ pagamentos: movimentos }
        });
      }
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invoice Pay</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="carteira">Carteira de Recebimento</Label>
            <Controller
              name="carteira"
              control={control}
              rules={{ required: "Carteira is required." }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    className="react-select"
                    classNamePrefix="select"
                    options={walletOptions}
                    onChange={(selected) => {
                      field.onChange(selected ? selected : undefined);
                    }}
                    formatOptionLabel={(option) => {  // Customiza a renderização da opção
                      const IconComponent = avatarComponents[option.avatar as IconType]; // Assumindo que "avatar" é um campo nas opções

                      return (
                        <div className="flex items-center">
                          {IconComponent ? (
                            <Avatar className="flex-none h-5 w-5 rounded mr-2">
                              <IconComponent fontSize="20px" />
                            </Avatar>
                          ) : (
                            <Icon icon={option.avatar} className='w-5 h-5 text-default-500 dark:text-secondary-foreground mr-2' />
                          )}
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                      );
                    }}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="datapg">Data de Pagamento</Label>
            <Controller
              name="datapg"
              control={control}
              defaultValue={getCurrentDate()}
              rules={{ required: "Data da Compra is required." }}
              render={({ field, fieldState }) => (
                <>
                  <CleaveInput
                    {...field}
                    id="date"
                    options={{ date: true, datePattern: ["d", "m", "Y"] }}
                    placeholder="MM/DD/YYYY"
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="valor">Valor</Label>
            <Controller
              name="valor"
              control={control}
              defaultValue={dataInvoice ? convertFloatToMoeda(dataInvoice.total) : ""} // Valor inicial
              rules={{
                required: "Valor é obrigatório.",
                validate: (value) =>
                  value !== "" && value !== "R$ " || "Por favor, insira um valor válido.",
              }}
              render={({ field, fieldState }) => (
                <>
                  <CleaveInput
                    id="valor"
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
                    placeholder="Digite o valor"
                    value={field.value} // Controlado pelo React Hook Form
                    onChange={(e) => {
                      const formattedValue = e.target.value;
                      field.onChange(formattedValue);
                    }}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                  )}
                </>
              )}
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

export default PayInvoice;
