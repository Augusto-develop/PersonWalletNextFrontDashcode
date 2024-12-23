'use client';
import { redirect } from "next/navigation";
import fetchWithAuth from "./login-actions";
import { CreditCard } from "@/app/[locale]/(protected)/credits/creditcards/components/creditcard-context";
import {CreditCardDto} from "./types.schema.dto";

export type CreditCardOption = {
    label: string;
    value: string;
    avatar: string;
};

export const getCreditCards = async (): Promise<CreditCard[]> => {

    const queryParams = new URLSearchParams();
    queryParams.append('type', 'CARTAO')

    const res = await fetchWithAuth(`/credito?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: CreditCard[] = [];

    if (res.ok) {
        const data: CreditCardDto[] = await res.json();

        newData = data.map((item) => (convertToCreditCard(item)));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const createCreditCard = async (payload: CreditCardDto): Promise<CreditCardDto | undefined> => {
    
    delete payload.id;

    const res = await fetchWithAuth("/credito", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newCredit: CreditCardDto= await res.json();        
        return newCredit;
    } 

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const editCreditCard = async (payload: CreditCardDto): Promise<CreditCardDto | undefined> => {
    
    const res = await fetchWithAuth("/credito/" + payload.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

    if (res.ok) {
        const newCredit: CreditCardDto = await res.json();        
        return newCredit;
    } 

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
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

export function convertToCreditCard(credit: CreditCardDto): CreditCard {
    return {
        id: credit.id ?? '',
        title: credit.descricao,
        avatar: credit.emissor,
        diavenc: credit.diavenc,
        diafech: credit.diafech,
        limite: credit.valorcredito?.toString(),
        emissor: credit.emissor,
        bandeira: credit.bandeira,
        progress: 10,
    };
}

export const createOptionsCreditCards = async (): Promise<CreditCardOption[]> => {

    const creditcards: CreditCard[] = await getCreditCards();

    const creditcardOptions: CreditCardOption[] = creditcards.map((item) => ({
        label: item.title,
        value: item.id,
        avatar: item.avatar,
    })) as CreditCardOption[];

    return creditcardOptions;
}