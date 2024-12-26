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
import { convertToRecurring, createRecurring, editRecurring } from "@/action/recurring-actions";
import { Recurring, useRecurringContext } from "./recurring-context";
import { RecurringDto } from "@/action/types.schema.dto";

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataRecurring?: Recurring | null
}

type Inputs = {
  id?: string;
  descricao: string;
  credor: Option;
  vencimento: Option;
  valorcredito: string; 
}

const submitCreate = async (data: Inputs): Promise<RecurringDto | undefined> => {

  const payload: RecurringDto = {
    id: data.id ?? "",
    descricao: data.descricao,
    diavenc: addLeadingZeros(data.vencimento.value, 2),
    valorcredito: convertToNumeric(data.valorcredito),
    type: "DESPESAFIXA"
  };

  try {
    return payload.id?.trim() !== "" ?
      editRecurring(payload) :
      createRecurring(payload);
  } catch (error) {
    console.error("Erro de requisição:", error);
  }
};

const CreateRecurring = ({ open, setOpen, dataRecurring = null }: CreateTaskProps) => {

  const { recurrings, setRecurrings, editRecurring } = useRecurringContext();  // Access context state and setter  

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    //editar
    if (dataRecurring !== null && dataRecurring !== undefined) {
      data.id = dataRecurring.id;
      const editCredit: RecurringDto | undefined = await submitCreate(data);
      if (editCredit) {
        const editCard: Recurring = convertToRecurring(editCredit);
        editRecurring(dataRecurring.id, editCard);
      }
    } else {
      data.id = undefined;
      const newCredit: RecurringDto | undefined = await submitCreate(data);
      if (newCredit) {
        const newCard: Recurring = convertToRecurring(newCredit);
        setRecurrings((prevCards) => [...prevCards, newCard]);
      }
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Recurring</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              {...register("descricao", { required: "Descrição is required." })}
              color={errors.descricao ? "destructive" : "secondary"}
              defaultValue={dataRecurring !== null ? dataRecurring.descricao : ""}
            />
            {errors.descricao && <p className="text-destructive  text-sm font-medium">{errors.descricao.message}</p>}
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div className="space-y-1">
              <Label htmlFor="vencimento">Vencimento</Label>
              <Controller
                name="vencimento"
                control={control}
                defaultValue={dataRecurring !== null ?
                  dayOptions.find((option) => option.value === dataRecurring.diavenc) :
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
            <div className="space-y-1">
              <Label htmlFor="valorcredito">Valor</Label>
              <Controller
                name="valorcredito"
                control={control}
                defaultValue={dataRecurring ? convertFloatToMoeda(dataRecurring.valorcredito) : ""} // Valor inicial
                rules={{
                  required: "Valor é obrigatório.",
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
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>

      </DialogContent>
    </Dialog >
  );
};

export default CreateRecurring;
