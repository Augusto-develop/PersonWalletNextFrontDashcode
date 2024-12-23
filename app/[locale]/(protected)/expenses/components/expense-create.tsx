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
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { ExpenseDto, convertDtoToExpense, createExpense, editExpense } from "@/action/expense-actions";
import { Expense, useExpenseContext } from "./expense-context";
import { CategoryOption, createOptionsCategories } from "@/action/category-actions";
import Select, { MultiValue } from 'react-select'
import { CleaveInput } from "@/components/ui/cleave";
import { convertFloatToMoeda, convertToNumeric, getCurrentDate, convertToAmericanDate } from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataExpense?: Expense | null
}

type Inputs = {
  id?: string;
  creditId: string;
  mesfat: string;
  anofat: string;
  description: string;
  categoria: string;
  parcela: string;
  datacompra: string;
  valor: string;
}

const separateParcela = (value: string) => {
  const [part1, part2] = value.split('/');
  const trimmedPart1 = part1.trim();
  const trimmedPart2 = part2.trim();

  // Convertendo as parcelas para inteiros
  const intPart1 = parseInt(trimmedPart1, 10);
  const intPart2 = parseInt(trimmedPart2, 10);

  return { part1: intPart1, part2: intPart2 };
};

const submitCreate = async (data: Inputs

): Promise<ExpenseDto | undefined> => {

  console.log(convertToNumeric(data.valor));

  const parcela = separateParcela(data.parcela);
  const valor = convertToNumeric(data.valor);

  //Prepara o payload
  const payload: ExpenseDto = {
    id: data.id ?? "",
    creditId: data.creditId,
    descricao: data.description,
    categoriaId: data.categoria,
    anofat: data.anofat,
    mesfat: data.mesfat,
    numparc: parcela.part1,
    qtdeparc: parcela.part2,
    lancamento: new Date(convertToAmericanDate(data.datacompra)).toISOString(),
    valor: valor?.toString() || "0",
    fixa: false,
    generateparc: false,   
  };

  try {
    return payload.id?.trim() !== "" ?
      editExpense(payload) :
      createExpense(payload);
  } catch (error) {
    console.error("Erro de requisição:", error);
  }
};


const CreateExpense = ({ open, setOpen, dataExpense = null }: CreateTaskProps) => {

  const { expenses, setExpenses, editExpense, filter } = useExpenseContext();
  const [categoriaOptions, setCategoriaOptions] = useState<CategoryOption[]>([]);

  useEffect(() => {
    const fetchCategoryOptions = async () => {
      const options: CategoryOption[] = await createOptionsCategories();
      setCategoriaOptions(options);
    };

    fetchCategoryOptions();
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

    data.id = dataExpense?.id ?? undefined;
    data.creditId = filter.creditcard;
    data.mesfat = filter.mes;
    data.anofat = filter.ano;

    const expenseDto: ExpenseDto | undefined = await submitCreate(data);
    if (expenseDto) {
      const row: Expense = convertDtoToExpense(expenseDto);
      data.id ?
        editExpense(data.id, row) :
        setExpenses((prevRows) => [...prevRows, row]);
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="space-y-1">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              size="md"
              placeholder="Description Expense"
              {...register("description", { required: "Descrição is required." })}
              color={errors.description ? "destructive" : "secondary"}
              defaultValue={dataExpense?.description || ""}
            />
            {errors.description &&
              <p className="text-destructive  text-sm font-medium">{errors.description.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="categoria">Categoria</Label>
            <Controller
              name="categoria"
              control={control}
              defaultValue={dataExpense !== null ?
                categoriaOptions.find((option) => option.value === dataExpense.categoriaId)?.value :
                undefined}
              rules={{ required: "Categoria is required." }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    className="react-select"
                    classNamePrefix="select"
                    options={categoriaOptions}
                    value={categoriaOptions.find(option => option.value === field.value)}  // Passa apenas o objeto selecionado
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
            <Label htmlFor="datacompra">Data da Compra</Label>
            <Controller
              name="datacompra"
              control={control}
              defaultValue={dataExpense?.lancamento || getCurrentDate()}
              rules={{ required: "Data da Compra is required." }}
              render={({ field, fieldState }) => (
                <>
                  <CleaveInput
                    {...field}
                    id="date"
                    options={{ date: true, datePattern: ["d", "m", "Y"] }}
                    placeholder="MM/DD/YYYY"
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
              placeholder=""
              value={dataExpense !== null ? convertFloatToMoeda(dataExpense.valor) : ""}
              {...register("valor", {
                required: "Valor is required.",
                validate: (value) => value !== "R$ " || "Por favor, insira um valor válido."
              })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="parcela">Parcela</Label>
            <Controller
              name="parcela"
              control={control}
              defaultValue={dataExpense?.numparcela || "001/ 001"}
              rules={{ required: "Parcela is required." }}
              render={({ field, fieldState }) => (
                <>
                  <CleaveInput
                    {...field}
                    options={{
                      delimiter: ' / ',  // Delimitador entre o número da parcela e o total
                      blocks: [3, 3],   // Define 1 dígito para o número da parcela e 1 para o total de parcelas
                      numericOnly: true, // Permite apenas números
                    }}
                    placeholder="001 / 001"
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          {/* <div className="flex items-center gap-3">
            <Label htmlFor="active">Ativo</Label>
            <Controller
              name="active"
              control={control}
              defaultValue={dataExpense?.active || false} // Valor padrão baseado no `dataExpense`
              render={({ field }) => (
                <Switch
                  id="active"
                  checked={field.value} // O estado é gerenciado pelo `react-hook-form`
                  onCheckedChange={field.onChange} // Atualiza o estado no formulário
                  color="info"
                />
              )}
            />
          </div> */}

          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>

      </DialogContent>
    </Dialog >
  );
};

export default CreateExpense;
