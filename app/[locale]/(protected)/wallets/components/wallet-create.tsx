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
import { Switch } from "@/components/ui/switch";
import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { WalletDto, convertDtoToWallet, createWallet, editWallet } from "@/action/wallet-actions";
import { Wallet, useWalletContext } from "./wallet-context";

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataWallet?: Wallet | null
}

type Inputs = {
  id?: string;
  description: string;
  active?: boolean;
}

const submitCreate = async (data: {
  id?: string | null;
  description: any;
  active?: any;
}): Promise<WalletDto | undefined> => {

  // Prepara o payload
  const payload: WalletDto = {
    id: data.id ?? "",
    descricao: data.description,
    ativo: data.active,
  };

  try {
    return payload.id?.trim() !== "" ?
      editWallet(payload) :
      createWallet(payload);
  } catch (error) {
    console.error("Erro de requisição:", error);
  }
};

const CreateWallet = ({ open, setOpen, dataWallet = null }: CreateTaskProps) => {

  const { wallets, setWallets, editWallet } = useWalletContext();  

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {

    data.id = dataWallet?.id ?? undefined;

    const walletDto: WalletDto | undefined = await submitCreate(data);
    if (walletDto) {
      const row: Wallet = convertDtoToWallet(walletDto);
      data.id ?
        editWallet(data.id, row) :
        setWallets((prevRows) => [...prevRows, row]);
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Wallet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-1">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Description Wallet"
              {...register("description", { required: "Descrição is required." })}
              color={errors.description ? "destructive" : "default"}
              defaultValue={dataWallet?.description || ""}
            />
            {errors.description &&
              <p className="text-destructive  text-sm font-medium">{errors.description.message}</p>}
          </div>

          <div className="flex items-center gap-3">
            <Label htmlFor="active">Ativo</Label>
            <Controller
              name="active"
              control={control}
              defaultValue={dataWallet?.active || false} // Valor padrão baseado no `dataWallet`
              render={({ field }) => (
                <Switch
                  id="active"
                  checked={field.value} // O estado é gerenciado pelo `react-hook-form`
                  onCheckedChange={field.onChange} // Atualiza o estado no formulário
                  color="info"
                />
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

export default CreateWallet;
