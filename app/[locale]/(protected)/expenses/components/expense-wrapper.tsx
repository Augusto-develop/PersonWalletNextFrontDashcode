"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Loader2 } from "lucide-react";
import CreateExpense from "./expense-create";
import ReaderInvoice from "./invoice-reader";
import Select from "react-select";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { avatarComponents } from "@/components/pwicons/pwicons";
import { Avatar } from "@/components/ui/avatar";
import { addLeadingZeros, months } from "@/lib/utils";
import { useExpenseContext } from "./expense-context";
import { getExpenses, createExpenseRecurring, getInvoiceSums } from "@/action/expense-actions";
import { Icon } from "@/components/ui/icon";
import { createOptionsGroupCredit } from "@/app/[locale]/(protected)/credits/credit-select-group";
import { InputsFilterExpense, IconType, GroupedCreditOption, ExpenseInvoiceSum, CategoryOption, WalletOption } from "@/lib/model/types";
import { TypeCredit } from "@/lib/model/enums";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "dayjs/locale/pt-br";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { themeCustomMuiDatepicker } from "@/components/mui-datepicker";
import { isUndefined } from "util";
import { createOptionsCategories } from "@/action/category-actions";
import { createOptionsWallets } from "@/action/wallet-actions";

const ExpenseWrapper = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [openReaderInvoice, setOpenReaderInvoice] = useState<boolean>(false); // Novo estado para "Reader Invoice"
    const [groupCreditOptions, setGroupCreditOptions] = useState<GroupedCreditOption[]>([]);

    const { expenses, setExpenses, filter, setFilter, setInvoiceSums, setCategoriaOptions, setWalletOptions } =
        useExpenseContext();

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Refs para campos que precisam de foco em caso de erro
    const selectRef = useRef<any>(null);
    const dateInputRef = useRef<HTMLInputElement | null>(null);

    // useEffect para carregar opções de grupos de crédito
    useEffect(() => {
        const fetchCreditGroupOptions = async () => {
            const options: GroupedCreditOption[] = await createOptionsGroupCredit();
            setGroupCreditOptions(options);
        };

        fetchCreditGroupOptions();
    }, [setGroupCreditOptions]); // Executa apenas uma vez, após a montagem do componente

    // useEffect para carregar opções de categorias
    useEffect(() => {
        const fetchCategoryOptions = async () => {
            const options: CategoryOption[] = await createOptionsCategories();
            setCategoriaOptions(options);
        };

        fetchCategoryOptions();
    }, [setCategoriaOptions]); // Executa apenas uma vez, após a montagem do componente

    // useEffect para carregar opções de carteiras
    useEffect(() => {
        const fetchWalletOptions = async () => {
            const options: WalletOption[] = await createOptionsWallets();
            setWalletOptions(options);
        };

        fetchWalletOptions();
    }, [setWalletOptions]); // Executa apenas uma vez, após a montagem do componente

    // Foca nos campos com erro
    useEffect(() => {
        if (filter?.credit?.error && selectRef.current) {
            selectRef.current.focus();
        }
    }, [filter?.credit?.error]);

    const { handleSubmit, control } = useForm<InputsFilterExpense>({
        defaultValues: {
            credit: undefined,
            mes: "",
            ano: "",
            competencia: undefined,
            isSubmit: false,
        },
    });

    const onSubmit: SubmitHandler<InputsFilterExpense> = async (data) => {
        setIsSubmitting(true);
        data.isSubmit = true;

        const dataFilter = { ...data };

        if (dataFilter.competencia) {
            dataFilter.mes = addLeadingZeros(dataFilter.competencia.$M + 1, 2).toString();
            dataFilter.ano = dataFilter.competencia.$y.toString();
        } else {
            dataFilter.mes = "00";
            dataFilter.ano = "0000";
        }

        const fetchedExpenses = await getExpenses(
            dataFilter.credit?.value,
            dataFilter.mes,
            dataFilter.ano,
            dataFilter.credit?.type
        );

        setInvoiceSums(await getInvoiceSums(
            dataFilter.credit?.value,
            dataFilter.mes,
            dataFilter.ano,
        ));

        setExpenses(fetchedExpenses);
        setFilter(dataFilter);
        setIsSubmitting(false);
    };

    const createDespesasFixas = async () => {
        const dataFilter = filter;
        const expensesFixas = await createExpenseRecurring({
            mesfat: dataFilter.mes,
            anofat: dataFilter.ano,
        });

        if (expensesFixas) {
            setExpenses([...expenses, ...expensesFixas]);
        }
    };

    return (

        <div>
            <CreateExpense open={open} setOpen={setOpen} />
            <ReaderInvoice
                open={openReaderInvoice}
                setOpen={setOpenReaderInvoice}
                creditId={filter.credit?.value ?? ""}
                mesfat={filter?.mes ?? ""}
                anofat={filter?.ano ?? ""}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex w-full items-center gap-4 mb-6">
                    <h4 className="flex-none font-medium lg:text-2xl text-xl capitalize text-default-900">
                        Expenses
                    </h4>
                    <div className="border-l border-gray-300 h-7"></div>
                    <Controller
                        name="credit"
                        control={control}
                        rules={{ required: "Campo obrigatório." }}
                        render={({ field, fieldState }) => (
                            <div className={`react-select-container ${fieldState.error ? "select-error" : ""}`}>
                                <Select
                                    {...field}
                                    ref={selectRef}
                                    className="react-select min-w-64"
                                    classNamePrefix="select"
                                    options={groupCreditOptions}
                                    placeholder="Select Option"
                                    formatOptionLabel={(option) => {
                                        const IconComponent = avatarComponents[option.avatar as IconType];
                                        return (
                                            <div className="flex items-center">
                                                {IconComponent ? (
                                                    <Avatar className="flex-none h-5 w-5 rounded mr-2">
                                                        <IconComponent fontSize="20px" />
                                                    </Avatar>
                                                ) : (
                                                    <Icon icon={option.avatar} className="w-5 h-5 text-default-500 dark:text-secondary-foreground mr-2" />
                                                )}
                                                <span className="text-sm font-medium">{option.label}</span>
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                        )}
                    />
                    <ThemeProvider theme={themeCustomMuiDatepicker}>
                        <CssBaseline />
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                            <DemoContainer components={["DatePicker"]}>
                                <Controller
                                    name="competencia"
                                    control={control}
                                    rules={{ required: "Campo obrigatório." }}
                                    render={({ field, fieldState }) => (
                                        <DatePicker
                                            {...field}
                                            inputRef={dateInputRef}
                                            views={["month", "year"]}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderColor: fieldState.error ? "red" : "",
                                                    "&:hover fieldset": {
                                                        borderColor: fieldState.error ? "red" : "",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: fieldState.error ? "red" : "",
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </ThemeProvider>
                    {isSubmitting ? (
                        <Button size="md" color="secondary" variant="soft" disabled>
                            <Loader2 className="me-2 h-4 w-4 animate-spin" />
                            Filtrar
                        </Button>
                    ) : (
                        <Button size="md" color="secondary" variant="soft" type="submit">
                            <Filter className="w-4 h-4 me-2" />
                            Filtrar
                        </Button>
                    )}
                    <div className="flex space-x-2 ml-auto">
                        {filter.credit?.type === TypeCredit.DESPESAFIXA ? (
                            <Button onClick={createDespesasFixas} disabled={!filter.isSubmit}>
                                <Plus className="w-4 h-3 me-1" />
                                Mount Recurring
                            </Button>
                        ) : (
                            <>
                                <Button onClick={() => setOpen(true)} disabled={!filter.isSubmit}>
                                    <Plus className="w-4 h-3 me-1" />
                                    Add
                                </Button>
                                <Button onClick={() => setOpenReaderInvoice(true)} disabled={!filter.isSubmit}>
                                    <Plus className="w-4 h-3 me-1" />
                                    Reader Invoice
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </form>
            {children}
        </div>
    );
};

export default ExpenseWrapper;
