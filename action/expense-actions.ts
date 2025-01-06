'use client';
import { addLeadingZeros, convertDatetimeToDate } from "@/lib/utils";
import fetchWithAuth from "./login-actions";
import { ExpenseDto, ExpenseInvoiceSumDto } from "./types.schema.dto";
import { Expense, ExpenseInvoiceSum } from "@/lib/model/types";
import { TypeCredit } from "@/lib/model/enums";

export const getExpenses = async (
    creditId?: string,
    mesfat?: string,
    anofat?: string,
    type?: TypeCredit
): Promise<Expense[]> => {
    // Monta a URL com os parâmetros opcionais
    const queryParams = new URLSearchParams();
    if (creditId) {
        if (type && type === TypeCredit.DESPESAFIXA) {
            queryParams.append('type', type);
        } else {
            queryParams.append('creditId', creditId);
        }
    }
    if (mesfat) queryParams.append('mesfat', mesfat);
    if (anofat) queryParams.append('anofat', anofat);

    const url = `/despesa${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    // Faz a requisição
    const res = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: Expense[] = [];

    if (res.ok) {
        const data: ExpenseDto[] = await res.json();
        newData = data.map((item) => convertDtoToExpense(item));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const getInvoiceSums = async (
    creditId?: string,
    mesfat?: string,
    anofat?: string,
): Promise<ExpenseInvoiceSum> => {

    const queryParams = new URLSearchParams();
    if (creditId) {
        queryParams.append('creditId', creditId);
    }
    if (mesfat) queryParams.append('mesfat', mesfat);
    if (anofat) queryParams.append('anofat', anofat);

    const url = `/despesa/invoice/sums${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    // Faz a requisição
    const res = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: ExpenseInvoiceSum = {
        current: 0,
        previous: 0,
        next: 0,
        future: 0,
    }

    if (res.ok) {
        const data: ExpenseInvoiceSumDto = await res.json();

        newData = {
            current: data.current.toString(),
            previous: data.previous.toString(),
            next: data.next.toString(),
            future: data.future.toString(),
        };

    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};


export const createExpense = async (payload: ExpenseDto): Promise<ExpenseDto | undefined> => {

    delete payload.id;

    const res = await fetchWithAuth("/despesa", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newExpenseDto: ExpenseDto = await res.json();
        return newExpenseDto;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const createExpenseRecurring = async (payload: { mesfat: string, anofat: string }): Promise<Expense[] | undefined> => {

    const res = await fetchWithAuth("/despesa/fixas", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newExpenseDto: ExpenseDto[] = await res.json();
        return newExpenseDto.map((item) => convertDtoToExpense(item));
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const editExpense = async (payload: ExpenseDto): Promise<ExpenseDto | undefined> => {

    const res = await fetchWithAuth("/despesa/" + payload.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newExpenseDto: ExpenseDto = await res.json();
        return newExpenseDto;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const deleteExpense = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/despesa/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export const createParcelasExpense = async (id: String): Promise<ExpenseDto | undefined> => {

    const res = await fetchWithAuth("/despesa/parcelas", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        }),
    });

    if (res.ok) {
        const newExpenseDto: ExpenseDto = await res.json();
        return newExpenseDto;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const deleteParcelasExpense = async (id: string): Promise<ExpenseDto | undefined> => {
    const res = await fetchWithAuth(`/despesa/parcelas/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (res.ok) {
        const newExpenseDto: ExpenseDto = await res.json();
        return newExpenseDto;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export function convertDtoToExpense(expenseDto: ExpenseDto): Expense {

    const isParcela: boolean = (expenseDto.qtdeparc > 0 && expenseDto.numparc < expenseDto.qtdeparc);
    const isParent: boolean = expenseDto.parentId != null && expenseDto.parentId !== "";
    const isParcelaGerada: boolean = expenseDto.generateparc;
    const isCreateParcelas: boolean = isParcela && isParcelaGerada === false && isParent === false;

    return {
        id: expenseDto.id ?? '',
        description: expenseDto.descricao,
        creditId: expenseDto.creditId ?? '',
        categoriaId: expenseDto.categoriaId,
        anofat: expenseDto.anofat,
        mesfat: expenseDto.mesfat,
        numparcela: expenseDto.numparc.toString(),
        qtdeparcela: expenseDto.qtdeparc.toString(),
        viewparcela: addLeadingZeros(expenseDto.numparc, 2) + ' / ' +
            addLeadingZeros(expenseDto.qtdeparc, 2),
        lancamento: convertDatetimeToDate(expenseDto.lancamento),
        valor: expenseDto.valor.toString(),
        isCreateParcelas: isCreateParcelas,
        isDeleteParcelas: isParcelaGerada,
        isDelete: !isParent && !isParcelaGerada,
        isParent: isParent
    };
}