"use client"
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import CreateRevenue from "./revenue-create";
import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { addLeadingZeros } from "@/lib/utils";
import { useRevenueContext } from "./revenue-context";
import { getRevenues } from "@/action/revenue-actions";
import { Loader2 } from "lucide-react";
import { InputsFilterRevenue } from "@/lib/model/types";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/pt-br';
import { ThemeProvider, CssBaseline, FormHelperText } from '@mui/material';
import { themeCustomMuiDatepicker } from "@/components/mui-datepicker";

const RevenueWrapper = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState<boolean>(false);    
    const { setRevenues, filter, setFilter } = useRevenueContext();
    const [isSubmitting, setIsSubmitting] = useState(false);    

    const {
        handleSubmit,
        control,
    } = useForm<InputsFilterRevenue>()

    const onSubmit: SubmitHandler<InputsFilterRevenue> = async (data) => {
        setIsSubmitting(true);
        data.isSubmit = true;

        const dataFilter: InputsFilterRevenue = data;

        if (dataFilter.competencia) {            
            dataFilter.mes = addLeadingZeros((dataFilter.competencia.$M + 1), 2).toString();
            dataFilter.ano = dataFilter.competencia.$y.toString();
        } else {
            dataFilter.mes = "00";
            dataFilter.ano = "0000";
        }

        const fetchedRevenues = await getRevenues({
            mes: dataFilter.mes,
            ano: dataFilter.ano,
        });
        setRevenues(fetchedRevenues);
        setFilter(dataFilter);
        setIsSubmitting(false);
    }

    return (
        <div>
            <CreateRevenue
                open={open}
                setOpen={setOpen}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex w-full items-center gap-4 mb-6">
                    <h4 className="flex-1 font-medium lg:text-2xl text-xl capitalize text-default-900">
                        Revenues
                    </h4>
                    <div className="space-y-1 ml-auto">
                        <Button
                            className="flex-none"
                            onClick={() => setOpen(true)}
                            disabled={filter.isSubmit === false}
                        >
                            <Plus className="w-4 h-3 me-1" />
                            <span>Add</span>
                        </Button>
                    </div>
                </div>
                <div className="flex w-full items-center gap-4 mb-6">
                    <div className="space-y-1">
                        <ThemeProvider theme={themeCustomMuiDatepicker}>
                            <CssBaseline />
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                                <DemoContainer components={['DatePicker']} sx={{ padding: 0 }}>
                                    <Controller
                                        name="competencia"
                                        control={control}
                                        rules={{ required: "Credit Card is required." }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <DatePicker
                                                    {...field}
                                                    views={['month', 'year']}
                                                    sx={{}}
                                                    onError={fieldState?.error ? (error) => console.log(error) : undefined}
                                                />
                                                {fieldState?.error && (
                                                    <FormHelperText error>{fieldState?.error?.message}</FormHelperText>
                                                )}
                                            </>
                                        )}
                                    />

                                </DemoContainer>
                            </LocalizationProvider>
                        </ThemeProvider>
                    </div>
                    <div className="space-y-1">
                        {isSubmitting ? (
                            <Button
                                size="md"
                                color="secondary"
                                variant="soft"
                                disabled // Desativa o botão durante o estado de envio
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
                </div>
            </form>
            {children}
        </div >
    );
};

export default RevenueWrapper;