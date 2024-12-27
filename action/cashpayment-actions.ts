'use client';
import fetchWithAuth from "./login-actions";
import { CashPaymentDto } from "./types.schema.dto";
import { CashPayment, CashPaymentOption } from "@/lib/model/types";
import { TypeCredit } from "@/lib/model/enums";

export const getCashPayments = async (): Promise<CashPayment[]> => {

    const queryParams = new URLSearchParams();
    queryParams.append('type', TypeCredit.AVISTA)

    const res = await fetchWithAuth(`/credito?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: CashPayment[] = [];

    if (res.ok) {
        const data: CashPaymentDto[] = await res.json();

        newData = data.map((item) => (convertToCashPayment(item)));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const createCashPayment = async (payload: CashPaymentDto): Promise<CashPaymentDto | undefined> => {

    delete payload.id;

    const res = await fetchWithAuth("/credito", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newCredit: CashPaymentDto = await res.json();
        return newCredit;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const editCashPayment = async (payload: CashPaymentDto): Promise<CashPaymentDto | undefined> => {

    const res = await fetchWithAuth("/credito/" + payload.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newCredit: CashPaymentDto = await res.json();
        return newCredit;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const deleteCashPayment = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/credito/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export function convertToCashPayment(credit: CashPaymentDto): CashPayment {
    return {
        id: credit.id ?? '',
        descricao: credit.descricao   
    }
}



export const createOptionsCashPayment = async (): Promise<CashPaymentOption[]> => {

    const cashpayments: CashPayment[] = await getCashPayments();

    const cashpaymentOptions: CashPaymentOption[] = cashpayments.map((item) => ({
        label: item.descricao,
        value: item.id,
        avatar: "mdi:cash-multiple",
        type: 'CASHPAYMENT'
    })) as CashPaymentOption[];

    return cashpaymentOptions;
}