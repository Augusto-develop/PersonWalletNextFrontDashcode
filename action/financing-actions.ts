'use client';
import { redirect } from "next/navigation";
import fetchWithAuth from "./login-actions";
import { Financing, FinancingOption } from "@/lib/model/types";
import { TypeCredit } from "@/lib/model/enums";
import { FinancingDto } from "./types.schema.dto";

export const getFinancings = async (): Promise<Financing[]> => {

    const queryParams = new URLSearchParams();
    queryParams.append('type', TypeCredit.FINANCIAMENTO)

    const res = await fetchWithAuth(`/credito?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: Financing[] = [];

    if (res.ok) {
        const data: FinancingDto[] = await res.json();

        newData = data.map((item) => (convertToFinancing(item)));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const createFinancing = async (payload: FinancingDto): Promise<FinancingDto | undefined> => {

    delete payload.id;

    const res = await fetchWithAuth("/credito", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newCredit: FinancingDto = await res.json();
        return newCredit;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const editFinancing = async (payload: FinancingDto): Promise<FinancingDto | undefined> => {

    const res = await fetchWithAuth("/credito/" + payload.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newCredit: FinancingDto = await res.json();
        return newCredit;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const deleteFinancing = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/credito/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export function convertToFinancing(credit: FinancingDto): Financing {
    return {
        id: credit.id ?? '',
        descricao: {
            text: credit.descricao,
            avatar: credit.emissor,
        },
        diavenc: credit.diavenc,
        valorcredito: credit.valorcredito?.toString(),
    }
}

export const createOptionsFinancing = async (): Promise<FinancingOption[]> => {

    const financings: Financing[] = await getFinancings();

    const financingOptions: FinancingOption[] = financings.map((item) => ({
        label: item.descricao.text,
        value: item.id,
        avatar: item.descricao.avatar,
        type: TypeCredit.FINANCIAMENTO
    })) as FinancingOption[];

    return financingOptions;
}