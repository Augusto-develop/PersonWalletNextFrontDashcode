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
import React, { } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { convertDtoToExpense, createExpense, editExpense as submitEditExpense } from "@/action/expense-actions";
import { useExpenseContext } from "./expense-context";
import Select from 'react-select'
import { CleaveInput } from "@/components/ui/cleave";
import { convertFloatToMoeda, convertToNumeric, getCurrentDate, convertToAmericanDate } from "@/lib/utils";
import { ExpenseDto } from "@/action/types.schema.dto";
import { Expense, IconType, Option } from "@/lib/model/types";
import { avatarComponents } from "@/components/pwicons/pwicons";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { TypeCredit } from "@/lib/model/enums";

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataExpense?: Expense | null
}

type Inputs = {
  id?: string;
  creditId: string | undefined;
  mesfat: string;
  anofat: string;
  description: string;
  categoria: Option;
  parcela: string;
  datacompra: string;
  valor: string;
  carteira?: Option;
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

const CreateExpense = ({ open, setOpen, dataExpense = null }: CreateTaskProps) => {

  const { expenses, setExpenses, editExpense, filter, categoriaOptions, walletOptions } = useExpenseContext();
  const isEditParent: boolean = dataExpense?.isParent || false;
  const isEditRecurring: boolean = filter.credit?.type === TypeCredit.DESPESAFIXA;
  const isCashPayment: boolean = filter.credit?.type === TypeCredit.AVISTA;
  const isLending: boolean = filter.credit?.type === TypeCredit.EMPRESTIMO;

  const submitCreate = async (data: Inputs

  ): Promise<ExpenseDto | undefined> => {

    const parcela = separateParcela(data?.parcela || '01/01');

    const payload: ExpenseDto = {
      id: data.id ?? "",
      creditId: data.creditId,
      descricao: data.description,
      categoriaId: (isEditParent || isEditRecurring) ? (dataExpense?.categoriaId ?? "") : data.categoria.value,
      anofat: data.anofat,
      mesfat: data.mesfat,
      numparc: parcela.part1,
      qtdeparc: parcela.part2,
      lancamento: new Date(convertToAmericanDate(data.datacompra)).toISOString(),
      valor: convertToNumeric(data.valor),
      generateparc: false,
      carteiraPg: data.carteira?.value
    };

    console.log(data);
    console.log(payload);

    try {
      return payload.id?.trim() !== "" ?
        submitEditExpense(payload) :
        createExpense(payload);
    } catch (error) {
      console.error("Erro de requisição:", error);
    }
  };

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
    data.creditId = filter.credit?.value;
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
          {(isEditParent || isEditRecurring) && (
            <div className="space-y-1">
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                size="md"
                placeholder="Categoria"
                color={"secondary"}
                defaultValue={dataExpense !== null ?
                  categoriaOptions.find((option) => option.value === dataExpense.categoriaId)?.label : undefined}
                readOnly
              />
            </div>
          )}
          {isEditParent === false && isEditRecurring === false && (
            <div className="space-y-1">
              <Label htmlFor="categoria">Categoria</Label>
              <Controller
                name="categoria"
                control={control}
                defaultValue={dataExpense !== null ?
                  categoriaOptions.find((option) => option.value === dataExpense.categoriaId) :
                  undefined}
                rules={{ required: "Categoria is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      className="react-select"
                      classNamePrefix="select"
                      options={categoriaOptions}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          )}
          <div className="space-y-1">
            <Label htmlFor="datacompra">{isEditRecurring || isLending ? "Vencimento" : "Data da Compra"}</Label>
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
                    readOnly={isEditParent || isEditRecurring}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              size="md"
              placeholder=""
              {...register("description", { required: "Descrição is required." })}
              color={errors.description ? "destructive" : "secondary"}
              defaultValue={dataExpense?.description || ""}
              readOnly={isEditParent || isEditRecurring}
            />
            {errors.description &&
              <p className="text-destructive  text-sm font-medium">{errors.description.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="parcela">Parcela</Label>
            <Controller
              name="parcela"
              control={control}
              defaultValue={dataExpense?.viewparcela || "01/ 01"}
              rules={{ required: "Parcela is required." }}
              render={({ field, fieldState }) => (
                <>
                  <CleaveInput
                    {...field}
                    options={{
                      delimiter: ' / ',  // Delimitador entre o número da parcela e o total
                      blocks: [2, 2],   // Define 1 dígito para o número da parcela e 1 para o total de parcelas
                      numericOnly: true, // Permite apenas números
                    }}
                    placeholder="01 / 01"
                    readOnly={isEditParent || isCashPayment}
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
              defaultValue={dataExpense ? convertFloatToMoeda(dataExpense.valor) : ""} // Valor inicial
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

          {isCashPayment && (
            <div className="space-y-1">
              <Label htmlFor="carteira">Carteira de Pagamento</Label>
              <Controller
                name="carteira"
                control={control}
                rules={{ required: "Carteira is required." }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      className="react-select"
                      classNamePrefix="select"
                      options={walletOptions}
                      value={walletOptions.find(option => option === field.value)}  // Passa apenas o objeto selecionado
                      onChange={(selected) => {
                        field.onChange(selected ? selected : undefined); // Passa apenas o value (id)
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
          )}

          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>

      </DialogContent>
    </Dialog >
  );
};

export default CreateExpense;
