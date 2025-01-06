"use client"
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
// import CreatePayment from "./payment-create";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { addLeadingZeros } from "@/lib/utils";
import { usePaymentContext } from "./payment-context";
import { getCreditInvoice } from "@/action/payment-actions";
import { Loader2 } from "lucide-react";
import { InputsFilterPayment, ExpensesForPayment, WalletOption } from "@/lib/model/types";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/pt-br';
import { ThemeProvider, CssBaseline, FormHelperText } from '@mui/material';
import { themeCustomMuiDatepicker } from "@/components/mui-datepicker";
import { createOptionsWallets } from "@/action/wallet-actions";

const PaymentWrapper = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { setExpensesForPayment, setFilter, setWalletOptions } = usePaymentContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchWalletOptions = async () => {
            const options: WalletOption[] = await createOptionsWallets();
            setWalletOptions(options);
        };

        fetchWalletOptions();
    }, []);

    const {
        handleSubmit,
        control,
    } = useForm<InputsFilterPayment>()

    const onSubmit: SubmitHandler<InputsFilterPayment> = async (data) => {
        setIsSubmitting(true);
        data.isSubmit = true;

        const dataFilter: InputsFilterPayment = data;

        if (dataFilter.competencia) {
            dataFilter.mes = addLeadingZeros((dataFilter.competencia.$M + 1), 2).toString();
            dataFilter.ano = dataFilter.competencia.$y.toString();
        } else {
            dataFilter.mes = "00";
            dataFilter.ano = "0000";
        }

        const fetchedExpenses = await getCreditInvoice({
            mes: dataFilter.mes,
            ano: dataFilter.ano,
        });
        setExpensesForPayment(fetchedExpenses);
        setFilter(dataFilter);
        setIsSubmitting(false);
    }

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    return (
        <div>
            {/* <CreatePayment
                open={open}
                setOpen={setOpen}
            /> */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex w-full items-center gap-4 mb-6">
                    <h4 className="flex-none font-medium lg:text-2xl text-xl capitalize text-default-900">
                        Payments
                    </h4>
                    <div className="border-l border-gray-300 h-7"></div>
                    <ThemeProvider theme={themeCustomMuiDatepicker}>
                        <CssBaseline />
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                            <DemoContainer components={['DatePicker']} sx={{ padding: 0 }}>
                                <Controller
                                    name="competencia"
                                    control={control}
                                    rules={{ required: "Campo obrigatório." }} // Mensagem para validação
                                    render={({ field, fieldState }) => {


                                        // Foca no campo se houver erro
                                        // useEffect(() => {
                                        //     if (fieldState?.error && inputRef.current) {
                                        //         inputRef.current.focus();
                                        //     }
                                        // }, [fieldState?.error]);

                                        return (
                                            <div className="flex flex-col">
                                                <DatePicker
                                                    {...field}
                                                    inputRef={inputRef} // Passa o ref para o input interno
                                                    views={['month', 'year']}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderColor: fieldState?.error ? 'red' : '',
                                                            '&:hover fieldset': {
                                                                borderColor: fieldState?.error ? 'red' : '',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: fieldState?.error ? 'red' : '',
                                                                boxShadow: fieldState?.error ? '0 0 0 2px red' : '',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        );
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </ThemeProvider>
                    {isSubmitting ? (
                        <Button
                            size="md"
                            color="secondary"
                            variant="soft"
                            disabled
                        >
                            <Loader2 className="me-2 h-4 w-4 animate-spin" />
                            Filtrar
                        </Button>
                    ) : (
                        <Button
                            size="md"
                            color="secondary"
                            variant="soft"
                            type="submit"
                        >
                            <Filter className="w-4 h-4 me-2" />
                            Filtrar
                        </Button>
                    )}
                </div>
            </form>

            {children}
        </div >
    );
};

export default PaymentWrapper;