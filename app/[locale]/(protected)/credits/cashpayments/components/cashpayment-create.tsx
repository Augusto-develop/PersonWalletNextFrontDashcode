"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { convertToCashPayment, createCashPayment, editCashPayment } from "@/action/cashpayment-actions";
import { useCashPaymentContext } from "./cashpayment-context";
import { CashPaymentDto } from "@/action/types.schema.dto";
import { CashPayment } from "@/lib/model/types";
import { TypeCredit } from "@/lib/model/enums";

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataCashPayment?: CashPayment | null
}

type Inputs = {
  id?: string;
  descricao: string;  
}

const submitCreate = async (data: Inputs): Promise<CashPaymentDto | undefined> => {

  const payload: CashPaymentDto = {
    id: data.id ?? "",
    descricao: data.descricao,    
    type: TypeCredit.AVISTA
  };

  try {
    return payload.id?.trim() !== "" ?
      editCashPayment(payload) :
      createCashPayment(payload);
  } catch (error) {
    console.error("Erro de requisição:", error);
  }
};

const CreateCashPayment = ({ open, setOpen, dataCashPayment = null }: CreateTaskProps) => {

  const { cashpayments, setCashPayments, editCashPayment } = useCashPaymentContext();  // Access context state and setter  

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    //editar
    if (dataCashPayment !== null && dataCashPayment !== undefined) {
      data.id = dataCashPayment.id;
      const editCredit: CashPaymentDto | undefined = await submitCreate(data);
      if (editCredit) {
        const editCard: CashPayment = convertToCashPayment(editCredit);
        editCashPayment(dataCashPayment.id, editCard);
      }
    } else {
      data.id = undefined;
      const newCredit: CashPaymentDto | undefined = await submitCreate(data);
      if (newCredit) {
        const newCard: CashPayment = convertToCashPayment(newCredit);
        setCashPayments((prevCards) => [...prevCards, newCard]);
      }
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create CashPayment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              {...register("descricao", { required: "Descrição is required." })}
              color={errors.descricao ? "destructive" : "secondary"}
              defaultValue={dataCashPayment !== null ? dataCashPayment.descricao : ""}
            />
            {errors.descricao && <p className="text-destructive  text-sm font-medium">{errors.descricao.message}</p>}
          </div> 
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>

      </DialogContent>
    </Dialog >
  );
};

export default CreateCashPayment;
