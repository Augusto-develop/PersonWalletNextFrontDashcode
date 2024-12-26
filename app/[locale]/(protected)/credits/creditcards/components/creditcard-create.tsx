"use client";
import { Button } from "@/components/ui/button";
import { addLeadingZeros, convertToNumeric, convertFloatToMoeda } from "@/lib/utils";
import { Option, bandeiraOptions, dayOptions, emissorOptions } from "@/lib/options-select";
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
import { convertToCreditCard, createCreditCard, editCreditCard } from "@/action/creditcard-actions";
import { CreditCard, useCreditCardContext } from "./creditcard-context";
import { CreditCardDto } from "@/action/types.schema.dto";

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataCreditCard?: CreditCard | null
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

const submitCreate = async (data: {
  descricao: any; vencimento: any; fechamento: any; bandeira: any; emissor: any; limite: any; id?: string | null;
}): Promise<CreditCardDto | undefined> => {

  // Prepara o payload
  const payload: CreditCardDto = {
    id: data.id ?? "",
    descricao: data.descricao,
    valorcredito: convertToNumeric(data.limite),
    type: "CARTAO",
    emissor: data.emissor.value,
    bandeira: data.bandeira.value,
    diavenc: addLeadingZeros(data.vencimento.value, 2),
    diafech: addLeadingZeros(data.fechamento.value, 2)
  }; 

  try {
    return payload.id?.trim() !== "" ?
      editCreditCard(payload) :
      createCreditCard(payload);
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
      const editCredit: CreditCardDto | undefined = await submitCreate(data);
      if (editCredit) {
        const editCard: CreditCard = convertToCreditCard(editCredit);
        editCreditCard(dataCreditCard.id, editCard);
      }
    } else {
      data.id = undefined;
      const newCredit: CreditCardDto | undefined = await submitCreate(data);
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
