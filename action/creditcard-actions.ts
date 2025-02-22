'use client';
import fetchWithAuth from "./login-actions";
import { CreditCard, CreditCardOption, Invoice } from "@/lib/model/types";
import { CreditCardDto, InvoiceDto } from "./types.schema.dto";
import { TypeCredit } from "@/lib/model/enums";
import { calculatePercentage, calculateValueMaxPixCredito } from "@/lib/utils";


export const getCreditCards = async (): Promise<CreditCard[]> => {

    // const queryParams = new URLSearchParams();
    // queryParams.append('type', TypeCredit.CARTAO)

    const res = await fetchWithAuth(`/credito/cartoes`, {
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
        const newCredit: CreditCardDto = await res.json();
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
   
    const valorCredito = parseFloat(credit.valorcredito?.toString() || "0");
    const limite = parseFloat(credit.limite?.toString() || "0");
    const limiteUsado = valorCredito - limite;

    return {
        id: credit.id || '',
        title: credit.descricao || '',
        avatar: credit.emissor || '',
        diavenc: credit.diavenc,
        diafech: credit.diafech,
        limite: valorCredito.toString(),
        disponivel: limite.toString(),
        emissor: credit.emissor || '',
        bandeira: credit.bandeira || '',
        progress: calculatePercentage(limiteUsado, valorCredito),
        maxPixCredito: calculateValueMaxPixCredito(limite).toString()
    };
}

export const createOptionsCreditCards = async (): Promise<CreditCardOption[]> => {

    const creditcards: CreditCard[] = await getCreditCards();

    const creditcardOptions: CreditCardOption[] = creditcards.map((item) => ({
        label: item.title,
        value: item.id,
        avatar: item.avatar,
        type: TypeCredit.CARTAO
    })) as CreditCardOption[];

    return creditcardOptions;
}


