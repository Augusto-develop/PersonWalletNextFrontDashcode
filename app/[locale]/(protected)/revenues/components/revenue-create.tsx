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
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { convertDtoToRevenue, createRevenue, editRevenue as submitEditRevenue } from "@/action/revenue-actions";
import { useRevenueContext } from "./revenue-context";
import { createOptionsCategories } from "@/action/category-actions";
import Select from 'react-select'
import { CleaveInput } from "@/components/ui/cleave";
import { convertFloatToMoeda, convertToNumeric, getCurrentDate, convertToAmericanDate } from "@/lib/utils";
import { RevenueDto } from "@/action/types.schema.dto";
import { createOptionsWallets } from "@/action/wallet-actions";
import { Revenue, CategoryOption, WalletOption, IconType, Option } from "@/lib/model/types";
import { avatarComponents } from "@/components/pwicons/pwicons";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { TypeCredit } from "@/lib/model/enums";
import dayjs from "dayjs";
import { dayOptions } from "@/lib/options-select";

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataRevenue?: Revenue | null
}

type Inputs = {
  id?: string;
  carteira: WalletOption;
  descricao: string;
  diareceb: Option;
  valor: string;
}

const CreateRevenue = ({ open, setOpen, dataRevenue = null }: CreateTaskProps) => {

  const { revenues, setRevenues, editRevenue, filter } = useRevenueContext();
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);

  const submitCreate = async (data: Inputs

  ): Promise<RevenueDto | undefined> => {

    const payload: RevenueDto = {
      id: data.id ?? "",
      descricao: data.descricao,
      valor: convertToNumeric(data.valor),
      carteiraId: data.carteira.value,
      datareceb: dayjs(`${filter.ano}-${filter.mes}-${data.diareceb.value}`).toISOString(),
      fixa: false
    };

    try {
      return payload.id?.trim() !== "" ?
        submitEditRevenue(payload) :
        createRevenue(payload);
    } catch (error) {
      console.error("Erro de requisição:", error);
    }
  };

  useEffect(() => {
    const fetchWalletOptions = async () => {
      const options: WalletOption[] = await createOptionsWallets();
      setWalletOptions(options);
    };

    fetchWalletOptions();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {

    data.id = dataRevenue?.id ?? undefined;

    const revenueDto: RevenueDto | undefined = await submitCreate(data);
    if (revenueDto) {
      const row: Revenue = convertDtoToRevenue(revenueDto);
      data.id ?
        editRevenue(data.id, row) :
        setRevenues((prevRows) => [...prevRows, row]);
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Revenue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="carteira">Carteira de Recebimento</Label>
            <Controller
              name="carteira"
              control={control}
              rules={{ required: "Carteira is required." }}
              defaultValue={
                dataRevenue
                  ? walletOptions.find((option) => option.value === dataRevenue.carteiraId)
                  : undefined
              }
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
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              size="md"
              placeholder=""
              {...register("descricao", { required: "Descrição is required." })}
              color={errors.descricao ? "destructive" : "secondary"}
              defaultValue={dataRevenue?.descricao || ""}
            />
            {errors.descricao &&
              <p className="text-destructive  text-sm font-medium">{errors.descricao.message}</p>}
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div className="space-y-1">
              <Label htmlFor="diareceb">Dia do Recebimento</Label>
              <Controller
                name="diareceb"
                control={control}
                defaultValue={dataRevenue !== null ?
                  dayOptions.find((option) => option.value === dataRevenue.diareceb) :
                  undefined}
                rules={{ required: "Dia do Recebimento is required." }}
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
              <Label htmlFor="valor">Valor</Label>
              <Controller
                name="valor"
                control={control}
                defaultValue={dataRevenue ? convertFloatToMoeda(dataRevenue.valor) : ""} // Valor inicial
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
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>

      </DialogContent>
    </Dialog >
  );
};

export default CreateRevenue;
