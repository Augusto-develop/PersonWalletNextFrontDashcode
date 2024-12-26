"use client";
import { Button } from "@/components/ui/button";
import { addLeadingZeros, convertToNumeric, convertFloatToMoeda } from "@/lib/utils";
import { Option, dayOptions, emissorOptions } from "@/lib/options-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import Select from 'react-select'
import { CleaveInput } from "@/components/ui/cleave";
import fetchWithAuth from "@/action/login-actions";
import { convertToFinancing, createFinancing, editFinancing } from "@/action/financing-actions";
import { Financing, useFinancingContext } from "./financing-context";
import { FinancingDto } from "@/action/types.schema.dto";

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataFinancing?: Financing | null
}

type Inputs = {
  id?: string;
  descricao: string;
  credor: Option;
  vencimento: Option;
  valorcredito: string;
}

const submitCreate = async (data: Inputs): Promise<FinancingDto | undefined> => {

  const payload: FinancingDto = {
    id: data.id ?? "",
    descricao: data.descricao,
    diavenc: addLeadingZeros(data.vencimento.value, 2),
    valorcredito: convertToNumeric(data.valorcredito),
    type: "FINANCIAMENTO",
    emissor: data.credor.value
  };

  try {
    return payload.id?.trim() !== "" ?
      editFinancing(payload) :
      createFinancing(payload);
  } catch (error) {
    console.error("Erro de requisição:", error);
  }
};

const CreateFinancing = ({ open, setOpen, dataFinancing = null }: CreateTaskProps) => {

  const { financings, setFinancings, editFinancing } = useFinancingContext();  // Access context state and setter  

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    //editar
    if (dataFinancing !== null && dataFinancing !== undefined) {
      data.id = dataFinancing.id;
      const editCredit: FinancingDto | undefined = await submitCreate(data);
      if (editCredit) {
        const editCard: Financing = convertToFinancing(editCredit);
        editFinancing(dataFinancing.id, editCard);
      }
    } else {
      data.id = undefined;
      const newCredit: FinancingDto | undefined = await submitCreate(data);
      if (newCredit) {
        const newCard: Financing = convertToFinancing(newCredit);
        setFinancings((prevCards) => [...prevCards, newCard]);
      }
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Financing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              {...register("descricao", { required: "Descrição is required." })}
              color={errors.descricao ? "destructive" : "secondary"}
              defaultValue={dataFinancing !== null ? dataFinancing.descricao.text : ""}
            />
            {errors.descricao && <p className="text-destructive  text-sm font-medium">{errors.descricao.message}</p>}
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div className="space-y-1">
              <Label htmlFor="credor">Credor</Label>
              <Controller
                name="credor"
                control={control}
                defaultValue={dataFinancing !== null ?
                  emissorOptions.find((option) => option.value === dataFinancing.descricao.avatar) :
                  undefined}
                rules={{ required: "Emissor is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      className="react-select"
                      classNamePrefix="select"
                      options={emissorOptions}
                      placeholder=""
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="vencimento">Vencimento</Label>
              <Controller
                name="vencimento"
                control={control}
                defaultValue={dataFinancing !== null ?
                  dayOptions.find((option) => option.value === dataFinancing.diavenc) :
                  undefined}
                rules={{ required: "Vencimento is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      className="react-select"
                      classNamePrefix="select"
                      options={dayOptions}
                      placeholder=""
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
            <Label htmlFor="valorcredito">Valor do Financiamento</Label>
            <Controller
              name="valorcredito"
              control={control}
              defaultValue={dataFinancing ? convertFloatToMoeda(dataFinancing.valorcredito) : ""} // Valor inicial
              rules={{
                required: "Valor do Financimento é obrigatório.",
                validate: (value) =>
                  value !== "" && value !== "R$ " || "Por favor, insira um valor válido.",
              }}
              render={({ field, fieldState }) => (
                <>
                  <CleaveInput
                    id="valorcredito"
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

export default CreateFinancing;
