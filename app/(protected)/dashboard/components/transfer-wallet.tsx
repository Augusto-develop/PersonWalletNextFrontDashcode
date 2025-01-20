"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import Select from 'react-select'
import { CleaveInput } from "@/components/ui/cleave";
import { convertFloatToMoeda, convertToNumeric, getCurrentDate, convertToAmericanDate } from "@/lib/utils";
import { createOptionsWallets } from "@/action/wallet-actions";
import { WalletOption, IconType, Invoice, Movement } from "@/lib/model/types";
import { avatarComponents } from "@/components/pwicons/pwicons";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { MovementDto } from "@/action/types.schema.dto";
import { convertDtoToMovement, createMovement } from "@/action/movement-actions";
import { createPaymentStatus } from "@/action/payment-actions";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ThemeProvider, CssBaseline, FormHelperText } from '@mui/material';
import { themeCustomMuiDatepicker } from "@/components/mui-datepicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Dayjs } from "dayjs";
import dayjs from "@/lib/dayjs";
import { getISOWithLocalTimezone } from "@/lib/utils";

type Inputs = {
  carteiraDebit: WalletOption;
  carteiraCredit: WalletOption;
  datatransfer: Dayjs;
  valor: string;
}

const TransferWallet = () => {

  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);

  useEffect(() => {
    const fetchWalletOptions = async () => {
      const options: WalletOption[] = await createOptionsWallets();
      setWalletOptions(options);
    };

    fetchWalletOptions();
  }, [setWalletOptions]);

  const submitCreate = async (data: Inputs
  ): Promise<MovementDto | undefined> => {

    const payload: MovementDto = {
      cartdebito: data.carteiraDebit.value,
      cartcredito: data.carteiraCredit.value,
      ocorrencia: getISOWithLocalTimezone(data.datatransfer),
      valor: convertToNumeric(data.valor),
    };

    try {
      return createMovement(payload);
    } catch (error) {
      console.error("Erro de requisição:", error);
      return undefined;
    }
  };

  const {
    handleSubmit,
    control,
    reset
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {

    const movementDto: MovementDto | undefined = await submitCreate(data);

    if (movementDto) {
      reset({
        carteiraDebit: { label: "", value: "" },
        carteiraCredit: { label: "", value: "" },
        datatransfer: dayjs().tz("America/Sao_Paulo"),
        valor: "",
      });
      // const movimentos: Movement[] = movementDto.map(dto => convertDtoToMovement(dto));

    }
  }
  
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs().local());  // Usa o horário local

  return (
    <div className="space-y-6">
      <div className="bg-default-50 rounded-md p-4">
        <div className="flex items-center mb-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">              
              <div className="space-y-1">
                <ThemeProvider theme={themeCustomMuiDatepicker}>
                  <CssBaseline />
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                    <DemoContainer components={['DatePicker']} sx={{ padding: 0 }}>
                      <Controller
                        name="datatransfer"
                        control={control}
                        rules={{ required: "Campo obrigatório." }}
                        defaultValue={dayjs().tz("America/Sao_Paulo")}
                        render={({ field, fieldState }) => {                         
                          return (
                            <div className="flex flex-col">
                              <DemoItem label="Data">
                                <div className="custom-date-picker">
                                  <DesktopDatePicker
                                    {...field}
                                    value={selectedDate} // Use o estado diretamente como valor controlado
                                    onChange={(newValue) => {
                                      setSelectedDate(newValue); // Atualize o estado de selectedDate
                                      field.onChange(newValue);   // Atualize o valor controlado pelo React Hook Form
                                    }}
                                    slotProps={{
                                      textField: { fullWidth: true },
                                      popper: { className: 'custom-date-picker' },
                                    }}                                   
                                  />
                                </div>
                              </DemoItem>                              
                            </div>
                          );
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </ThemeProvider>
              </div>
              <div className="space-y-1">
                <Label htmlFor="valor">Valor</Label>
                <Controller
                  name="valor"
                  control={control}
                  rules={{
                    required: "Valor is required.",
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="carteira">Carteira de Débito</Label>
                <Controller
                  name="carteiraDebit"
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
                <Label htmlFor="carteira Credit">Carteira de Crédito</Label>
                <Controller
                  name="carteiraCredit"
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
            </div>

            <div className="flex justify-center mt-4">
              <Button type="submit">Transfer</Button>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};

export default TransferWallet;