'use client';
import { addLeadingZeros, convertDatetimeToDate } from "@/lib/utils";
import fetchWithAuth from "./login-actions";
import { ExpenseDto, MovementDto } from "./types.schema.dto";
import { Expense, Movement } from "@/lib/model/types";
import { TypeCredit } from "@/lib/model/enums";

// export const getExpenses = async (
//     creditId?: string,
//     mesfat?: string,
//     anofat?: string,
//     type?: TypeCredit
// ): Promise<Expense[]> => {
//     // Monta a URL com os parâmetros opcionais
//     const queryParams = new URLSearchParams();
//     if (creditId) {
//         if (type && type === TypeCredit.DESPESAFIXA) {
//             queryParams.append('type', type);
//         } else {
//             queryParams.append('creditId', creditId);
//         }
//     }
//     if (mesfat) queryParams.append('mesfat', mesfat);
//     if (anofat) queryParams.append('anofat', anofat);

//     const url = `/despesa${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

//     // Faz a requisição
//     const res = await fetchWithAuth(url, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });

//     let newData: Expense[] = [];

//     if (res.ok) {
//         const data: ExpenseDto[] = await res.json();
//         newData = data.map((item) => convertDtoToMovement(item));
//     } else {
//         console.error('Erro ao buscar os dados');
//     }
//     return newData;
// };

export const createMovement = async (payload: MovementDto): Promise<MovementDto | undefined> => {

    delete payload.id;

    const res = await fetchWithAuth("/movimento", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const movementDto: MovementDto = await res.json();
        return movementDto;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};


export const createPayment = async (payload: MovementDto): Promise<MovementDto[] | []> => {

    delete payload.id;

    const res = await fetchWithAuth("/movimento/pagamento", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const listMovementDto: MovementDto[] = await res.json();
        return listMovementDto;
    }

    // console.error("Erro ao enviar:", response.statusText)
    return [];
};

export const editMovement = async (payload: ExpenseDto): Promise<ExpenseDto | undefined> => {

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

export const deleteMovement = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/movimento/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export function convertDtoToMovement(movementDto: MovementDto): Movement {

    return {
        id: movementDto.id ?? '',
        cartdebito: movementDto.cartdebito,
        cartcredito: movementDto.cartcredito ?? '',
        valor: movementDto.valor.toString(),
        ocorrencia: convertDatetimeToDate(movementDto.ocorrencia),
        creditId: movementDto.creditId ?? '',
        anofat: movementDto.anofat ?? '',
        mesfat: movementDto.mesfat ?? '',
    };
}