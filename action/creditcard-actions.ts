'use client';
import { redirect } from "next/navigation";
import fetchWithAuth from "./login-actions";
import { CreditCard } from "@/app/[locale]/(protected)/credits/creditcards/creditcard-context";

export type Credit = {
    id: string;
    descricao: string;
    type: string;
    diavenc: string;
    valorcredito: string;
    valorparcela: string;
    diafech: string;
    emissor: string;
    bandeira: string;
};

export const getCreditCards = async (): Promise<CreditCard[]> => {

    const res = await fetchWithAuth("/credito", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: CreditCard[] = [];

    if (res.ok) {
        const data: Credit[] = await res.json();

        newData = data.map((item) => (convertToCreditCard(item)));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const deleteCreditCard = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/credito/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export function convertToCreditCard(credit: Credit): CreditCard {
    return {
        id: credit.id,
        title: credit.descricao,
        avatar: credit.emissor,
        diavenc: credit.diavenc,
        diafech: credit.diafech,
        limite: credit.valorcredito,
        emissor: credit.emissor,
        bandeira: credit.bandeira,
        progress: 90,
    };
}
