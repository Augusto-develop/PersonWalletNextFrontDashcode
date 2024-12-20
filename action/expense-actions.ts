'use client';
import fetchWithAuth from "./login-actions";
import { Expense } from "@/app/[locale]/(protected)/expenses/components/expense-context";

export type ExpenseDto = {
    id?: string;
    creditId?: string;
    categoriaId: string;
    anofat: string;
    mesfat: string;
    descricao: string;
    numparc: number;
    qtdeparc: number;
    lancamento: string;
    valor: string;
    fixa: boolean;
};

export const getExpenses = async (
    creditId?: string,
    mesfat?: string,
    anofat?: string
): Promise<Expense[]> => {
    // Monta a URL com os parâmetros opcionais
    const queryParams = new URLSearchParams();
    if (creditId) queryParams.append('creditId', creditId);
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

export function convertDtoToExpense(expenseDto: ExpenseDto): Expense {
    return {
        id: expenseDto.id ?? '',
        description: expenseDto.descricao,
        creditId: expenseDto.creditId ?? '',
        categoriaId: expenseDto.categoriaId,
        anofat: expenseDto.anofat,
        mesfat: expenseDto.mesfat,
        numparcela: expenseDto.numparc.toString(),
        qtdeparcela: expenseDto.qtdeparc.toString(),
        viewparcela: expenseDto.numparc + ' / ' + expenseDto.qtdeparc,
        lancamento: expenseDto.lancamento,
        valor: expenseDto.valor.toString(),
        fixa: expenseDto.fixa,
    };
}