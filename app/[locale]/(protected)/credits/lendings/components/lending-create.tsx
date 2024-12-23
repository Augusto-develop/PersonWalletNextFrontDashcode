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
import { convertToLending, createLending, editLending } from "@/action/lending-actions";
import { Lending, useLendingContext } from "./lending-context";
import { LendingDto } from "@/action/types.schema.dto";

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataLending?: Lending | null
}

type Inputs = {
  id?: string;
  descricao: string;
  credor: Option;
  vencimento: Option;
  valorcredito: string;
  valorparcela: string;
  qtdeparcela: string;
}

const submitCreate = async (data: Inputs): Promise<LendingDto | undefined> => {

  const payload: LendingDto = {
    id: data.id ?? "",
    descricao: data.descricao,
    diavenc: addLeadingZeros(data.vencimento.value, 2),
    valorcredito: convertToNumeric(data.valorcredito) || 0,
    valorparcela: convertToNumeric(data.valorparcela) || 0,
    type: "EMPRESTIMO",
    qtdeparcela: parseInt(data.qtdeparcela),
    emissor: data.credor.value
  };

  try {
    return payload.id?.trim() !== "" ?
      editLending(payload) :
      createLending(payload);
  } catch (error) {
    console.error("Erro de requisição:", error);
  }
};

const CreateLending = ({ open, setOpen, dataLending = null }: CreateTaskProps) => {

  const { lendings, setLendings, editLending } = useLendingContext();  // Access context state and setter  

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    //editar
    if (dataLending !== null && dataLending !== undefined) {
      data.id = dataLending.id;
      const editCredit: LendingDto | undefined = await submitCreate(data);
      if (editCredit) {
        const editCard: Lending = convertToLending(editCredit);
        editLending(dataLending.id, editCard);
      }
    } else {
      data.id = undefined;
      const newCredit: LendingDto | undefined = await submitCreate(data);
      if (newCredit) {
        const newCard: Lending = convertToLending(newCredit);
        setLendings((prevCards) => [...prevCards, newCard]);
      }
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Lending</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              {...register("descricao", { required: "Descrição is required." })}
              color={errors.descricao ? "destructive" : "secondary"}
              defaultValue={dataLending !== null ? dataLending.descricao.text : ""}
            />
            {errors.descricao && <p className="text-destructive  text-sm font-medium">{errors.descricao.message}</p>}
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div className="space-y-1">
              <Label htmlFor="credor">Credor</Label>
              <Controller
                name="credor"
                control={control}
                defaultValue={dataLending !== null ?
                  emissorOptions.find((option) => option.value === dataLending.descricao.avatar) :
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
                defaultValue={dataLending !== null ?
                  dayOptions.find((option) => option.value === dataLending.diavenc) :
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
              defaultValue={dataLending ? convertFloatToMoeda(dataLending.valorcredito) : ""} // Valor inicial
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
                      const rawValue = (e.target as any).rawValue; // Type assertion para acessar rawValue
                      field.onChange(rawValue);
                    }}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div className="space-y-1">
              <Label htmlFor="qtdeparcela">Qtde de Parcela</Label>
              <Controller
                name="qtdeparcela"
                control={control}
                defaultValue={dataLending?.parcela.qtde || ""}
                rules={{ required: "Qtde de Parcela is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <CleaveInput
                      {...field}
                      options={{
                        numericOnly: true,
                      }}
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
              <Label htmlFor="valorparcela">Valor da Parcela</Label>
              <Controller
                name="valorparcela"
                control={control}
                defaultValue={dataLending ? convertFloatToMoeda(dataLending.parcela.valor) : ""} // Valor inicial
                rules={{
                  required: "Valor da Parcela é obrigatória.",
                  validate: (value) =>
                    value !== "" && value !== "R$ " || "Por favor, insira um valor válido.",
                }}
                render={({ field, fieldState }) => (
                  <>
                    <CleaveInput
                      id="valorparcela"
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
                        const rawValue = (e.target as any).rawValue; // Type assertion para acessar rawValue
                        field.onChange(rawValue);
                      }}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>

      </DialogContent>
    </Dialog >
  );
};

export default CreateLending;
