"use client"
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import CreateExpense from "./expense-create";
import React, { useEffect, useState } from "react";
import Select from 'react-select'
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { CreditCardOption, createOptionsCreditCards } from "@/action/creditcard-actions";
import {
    avatarComponents, IconType
} from "@/components/pwicons/pwicons";
import { Avatar } from "@/components/ui/avatar";
import { CleaveInput } from "@/components/ui/cleave";
import { getCurrentMonth, getCurrentYear, months } from "@/lib/utils";
import { InputsFilter, useExpenseContext } from "./expense-context";
import { getExpenses } from "@/action/expense-actions";

const ExpenseWrapper = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [creditCardOptions, setCreditCardptions] = useState<CreditCardOption[]>([]);
    const { setExpenses, setFilter } = useExpenseContext();

    useEffect(() => {
        const fetchCreditCardOptions = async () => {
            const options: CreditCardOption[] = await createOptionsCreditCards();
            setCreditCardptions(options);
        };

        fetchCreditCardOptions();
    }, []);

    const {
        handleSubmit,
        control,
    } = useForm<InputsFilter>()
    const onSubmit: SubmitHandler<InputsFilter> = async (data) => {
        const dataFilter: InputsFilter = data;
        const fetchedExpenses = await getExpenses(dataFilter.creditcard, dataFilter.mes, dataFilter.ano);
        setExpenses(fetchedExpenses);
        setFilter(dataFilter);
    }

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
                        <Button
                            className="flex-none"
                            onClick={() => setOpen(true)}
                        >
                            <Plus className="w-4 h-3 me-1" />
                            <span>Add</span>
                        </Button>
                    </div>
                </div>
                <div className="flex w-full items-center gap-4 mb-6">
                    <div className="space-y-1">
                        <Controller
                            name="creditcard"
                            control={control}
                            rules={{ required: "Credit Card is required." }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Select
                                        {...field}
                                        className="react-select min-w-64"
                                        classNamePrefix="select"
                                        options={creditCardOptions}
                                        placeholder="Credit Card"
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
                                                        <div>Error: Icon not found</div>
                                                    )}
                                                    <span className="text-sm font-medium">{option.label}</span>
                                                </div>
                                            );
                                        }}
                                        value={creditCardOptions.find(option => option.value === field.value)}  // Passa apenas o objeto selecionado
                                        onChange={(selected) => {
                                            field.onChange(selected ? selected.value : undefined); // Passa apenas o value (id)
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
                    </div>
                    <div className="space-y-1">
                        <Button size="md" color="secondary" variant="soft" type="submit">
                            <Filter className="w-4 h-4 me-2" />
                            Filtrar
                        </Button>
                    </div>
                </div>
            </form>
            {children}
        </div >
    );
};

export default ExpenseWrapper;