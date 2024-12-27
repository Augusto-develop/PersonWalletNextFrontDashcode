'use client';
import { redirect } from "next/navigation";
import fetchWithAuth from "./login-actions";
import {LendingDto} from "./types.schema.dto";
import { CreditOption } from "@/app/[locale]/(protected)/credits/credit-select-group";
import { Lending, LendingOption } from "@/lib/model/types";
import { TypeCredit } from "@/lib/model/enums";

export const getLendings = async (): Promise<Lending[]> => {

    const queryParams = new URLSearchParams();
    queryParams.append('type', TypeCredit.EMPRESTIMO)

    const res = await fetchWithAuth(`/credito?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: Lending[] = [];

    if (res.ok) {
        const data: LendingDto[] = await res.json();

        newData = data.map((item) => (convertToLending(item)));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const createLending = async (payload: LendingDto): Promise<LendingDto | undefined> => {

    delete payload.id;

    const res = await fetchWithAuth("/credito", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newCredit: LendingDto = await res.json();
        return newCredit;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const editLending = async (payload: LendingDto): Promise<LendingDto | undefined> => {

    const res = await fetchWithAuth("/credito/" + payload.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newCredit: LendingDto = await res.json();
        return newCredit;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const deleteLending = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/credito/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export function convertToLending(credit: LendingDto): Lending {
    return {
        id: credit.id ?? '',
        descricao: {
            text: credit.descricao,
            avatar: credit.emissor,
        },       
        diavenc: credit.diavenc,
        valorcredito: credit.valorcredito?.toString()        
    }
}



export const createOptionsLending = async (): Promise<LendingOption[]> => {

    const lendings: Lending[] = await getLendings();

    const lendingOptions: LendingOption[] = lendings.map((item) => ({
        label: item.descricao.text,
        value: item.id,
        avatar: item.descricao.avatar,
    })) as LendingOption[];

    return lendingOptions;
}