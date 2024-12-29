'use client';
import fetchWithAuth from "./login-actions";
import { RecurringDto } from "./types.schema.dto";
import { Recurring, RecurringOption } from "@/lib/model/types";
import { TypeCredit } from "@/lib/model/enums";

export const getRecurrings = async (): Promise<Recurring[]> => {

    const queryParams = new URLSearchParams();
    queryParams.append('type', TypeCredit.DESPESAFIXA)

    const res = await fetchWithAuth(`/credito?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: Recurring[] = [];

    if (res.ok) {
        const data: RecurringDto[] = await res.json();

        newData = data.map((item) => (convertToRecurring(item)));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const createRecurring = async (payload: RecurringDto): Promise<RecurringDto | undefined> => {

    delete payload.id;    

    const res = await fetchWithAuth("/credito", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newCredit: RecurringDto = await res.json();
        return newCredit;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const editRecurring = async (payload: RecurringDto): Promise<RecurringDto | undefined> => {

    const res = await fetchWithAuth("/credito/" + payload.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newCredit: RecurringDto = await res.json();
        return newCredit;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const deleteRecurring = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/credito/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export function convertToRecurring(credit: RecurringDto): Recurring {
    return {
        id: credit.id ?? '',
        descricao: credit.descricao,
        diavenc: credit.diavenc,
        valorcredito: credit.valorcredito?.toString(),
        categoriaId: credit.categoriaId,
    }
}

export const createOptionsRecurring = async (): Promise<RecurringOption[]> => {

    const recurrings: Recurring[] = await getRecurrings();

    const recurringOptions: RecurringOption[] = recurrings.map((item) => ({
        label: item.descricao,
        value: item.id,
        avatar: "",    
        type: TypeCredit.DESPESAFIXA    
    })) as RecurringOption[];

    return recurringOptions;
}