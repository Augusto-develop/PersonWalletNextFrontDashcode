"use client"
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import CreateExpense from "./expense-create";
import React, { useEffect, useState } from "react";
import Select from 'react-select'
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import {
    avatarComponents
} from "@/components/pwicons/pwicons";
import { Avatar } from "@/components/ui/avatar";
import { CleaveInput } from "@/components/ui/cleave";
import { addLeadingZeros, getCurrentMonth, getCurrentYear, months } from "@/lib/utils";
import { useExpenseContext } from "./expense-context";
import { getExpenses, createExpenseRecurring } from "@/action/expense-actions";
import { Loader2 } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { createOptionsGroupCredit } from "@/app/[locale]/(protected)/credits/credit-select-group";
import { Expense, InputsFilterExpense, IconType, GroupedCreditOption } from "@/lib/model/types";
import { TypeCredit } from "@/lib/model/enums";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/pt-br';
import { ThemeProvider, CssBaseline, createTheme, FormHelperText } from '@mui/material';
import { themeCustomMuiDatepicker, DayJsObject } from "@/components/mui-datepicker";

const ExpenseWrapper = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [groupCreditOptions, setGroupCreditOtions] = useState<GroupedCreditOption[]>([]);
    const { expenses, setExpenses, filter, setFilter } = useExpenseContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCreditGroupOptions = async () => {
            const options: GroupedCreditOption[] = await createOptionsGroupCredit();
            setGroupCreditOtions(options);
        };

        fetchCreditGroupOptions();
    }, []);

    const {
        handleSubmit,
        control,
    } = useForm<InputsFilterExpense>()

    const onSubmit: SubmitHandler<InputsFilterExpense> = async (data) => {
        setIsSubmitting(true);
        data.isSubmit = true;

        const dataFilter: InputsFilterExpense = data;

        if (dataFilter.competencia) {
            // Se competencia for definido, podemos acessar suas propriedades com segurança
            dataFilter.mes = addLeadingZeros((dataFilter.competencia.$M + 1), 2).toString();
            dataFilter.ano = dataFilter.competencia.$y.toString();
        }else{
            dataFilter.mes = "00";
            dataFilter.ano = "0000";
        }

        const fetchedExpenses = await getExpenses(
            dataFilter.credit?.value,
            dataFilter.mes,
            dataFilter.ano,
            dataFilter.credit?.type
        );
        setExpenses(fetchedExpenses);
        setFilter(dataFilter);
        setIsSubmitting(false);
    }

    const createDespesasFixas = async () => {
        const dataFilter: InputsFilterExpense = filter;
        const expensesFixas: Expense[] | undefined = await createExpenseRecurring({
            mesfat: dataFilter.mes,
            anofat: dataFilter.ano
        });

        if (expensesFixas) {
            const newListExpenses: Expense[] = [...expenses, ...expensesFixas];
            setExpenses(newListExpenses);
        }
    };

    return (
        <div>
            <CreateExpense
                open={open}
                setOpen={setOpen}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex w-full items-center gap-4 mb-6">
                    <h4 className="flex-1 font-medium lg:text-2xl text-xl capitalize text-default-900">
                        Expenses
                    </h4>
                    <div className="space-y-1 ml-auto">
                        {filter.credit?.type === TypeCredit.DESPESAFIXA ? (
                            <Button
                                className="flex-none"
                                onClick={() => createDespesasFixas()}
                                disabled={filter.isSubmit === false}
                            >
                                <Plus className="w-4 h-3 me-1" />
                                <span>Mount Recurring</span>
                            </Button>
                        ) : (
                            <Button
                                className="flex-none"
                                onClick={() => setOpen(true)}
                                disabled={filter.isSubmit === false}
                            >
                                <Plus className="w-4 h-3 me-1" />
                                <span>Add</span>
                            </Button>
                        )
                        }
                    </div>
                </div>
                <div className="flex w-full items-center gap-4 mb-6">
                    <div className="space-y-1">
                        <Controller
                            name="credit"
                            control={control}
                            rules={{ required: "Credit Card is required." }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        {...field}
                                        className="react-select min-w-64"
                                        classNamePrefix="select"
                                        options={groupCreditOptions} // Passa as opções agrupadas
                                        placeholder="Select Option"
                                        getOptionLabel={(option) => option.label} // Retorna apenas o label para o filtro
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
                                        value={groupCreditOptions
                                            .flatMap(group => group.options)
                                            .find(option => option === field.value)}
                                        onChange={(selected) => {
                                            field.onChange(selected ? selected : undefined);
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
                                                    sx={{ }}
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



                    {/* <div className="space-y-1">
                        <Controller
                            name="mes"
                            control={control}
                            defaultValue={getCurrentMonth()}
                            rules={{ required: "Mês is required." }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        {...field}
                                        className="react-select min-w-48"
                                        classNamePrefix="select"
                                        options={months}
                                        placeholder="Mês"
                                        value={months.find((option) => option.value === field.value) || null} // Converte o valor para o formato esperado pelo Select
                                        onChange={(selected) => field.onChange(selected ? selected.value : undefined)} // Atualiza apenas o valor da string
                                    />
                                    {fieldState.error && (
                                        <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                    )}
                                </>
                            )}
                        />
                    </div>
                    <div className="space-y-1">
                        <Controller
                            name="ano"
                            control={control}
                            defaultValue={getCurrentYear()}
                            rules={{ required: "Ano is required." }}
                            render={({ field, fieldState }) => (
                                <>
                                    <CleaveInput
                                        {...field}
                                        className="input-text-filter w-32"
                                        options={{
                                            delimiter: '',  // Delimitador entre o número da parcela e o total
                                            blocks: [4],   // Define 1 dígito para o número da parcela e 1 para o total de parcelas
                                            numericOnly: true, // Permite apenas números
                                        }}
                                        placeholder="Ano"
                                    />
                                    {fieldState.error && (
                                        <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                    )}
                                </>
                            )}
                        />
                    </div> */}



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

export default ExpenseWrapper;