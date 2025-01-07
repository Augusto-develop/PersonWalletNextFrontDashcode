'use client';
import { addLeadingZeros, convertDatetimeToDate, getDayIsoDate } from "@/lib/utils";
import fetchWithAuth from "./login-actions";
import { RevenueDto } from "./types.schema.dto";
import { Revenue } from "@/lib/model/types";
import { TypeCredit } from "@/lib/model/enums";

export const getRevenues = async (payload: {
    mes: string,
    ano: string,
}): Promise<Revenue[]> => {

    const queryParams = new URLSearchParams({
        mesfat: payload.mes,
        anofat: payload.ano,
    });

    const url = `/receita${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    // Faz a requisição
    const res = await fetchWithAuth(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: Revenue[] = [];

    if (res.ok) {
        const data: RevenueDto[] = await res.json();
        newData = data.map((item) => convertDtoToRevenue(item));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const createRevenue = async (payload: RevenueDto): Promise<RevenueDto | undefined> => {

    delete payload.id;

    const res = await fetchWithAuth("/receita", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newRevenueDto: RevenueDto = await res.json();
        return newRevenueDto;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const editRevenue = async (payload: RevenueDto): Promise<RevenueDto | undefined> => {

    const res = await fetchWithAuth("/receita/" + payload.id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newRevenueDto: RevenueDto = await res.json();
        return newRevenueDto;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const deleteRevenue = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/receita/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export function convertDtoToRevenue(revenueDto: RevenueDto): Revenue {
    return {
        id: revenueDto.id ?? '',
        descricao: revenueDto.descricao,
        carteiraId: revenueDto.carteiraId,
        diareceb: getDayIsoDate(revenueDto.datareceb),
        valor: revenueDto.valor.toString(),
    };
}