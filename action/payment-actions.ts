'use client';
import fetchWithAuth from "./login-actions";
import { Invoice, ExpensesForPayment, TotalsPayment } from "@/lib/model/types";
import { InvoiceDto } from "./types.schema.dto";
import { TypeCredit } from "@/lib/model/enums";



export const getCreditInvoice = async (
    payload: { mesfat: string; anofat: string }
): Promise<ExpensesForPayment> => {
    try {
        // Construir os parâmetros da URL
        const queryParams = new URLSearchParams({
            mesfat: payload.mesfat,
            anofat: payload.anofat,
        });

        // Fazer a requisição
        const res = await fetchWithAuth(`/credito/faturas?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Inicializar estrutura padrão
        const expensesForPayment: ExpensesForPayment = {
            invoices: [],
            totals: {
                total1Quinze: 0,
                total2Quinze: 0,
                total1QuinzePago: 0,
                total2QuinzePago: 0
            }
        };

        // Processar resposta bem-sucedida
        if (res.ok) {
            const data: InvoiceDto[] = await res.json();

            // Mapear os dados e calcular os totais
            expensesForPayment.invoices = data.map(convertToInvoice);
            expensesForPayment.totals = calcTotals(expensesForPayment.invoices);
        } else {
            console.error("Erro ao buscar os dados:", res.statusText);
        }

        return expensesForPayment;
    } catch (error) {
        console.error("Erro inesperado ao buscar os dados:", error);
        throw new Error("Falha ao carregar as faturas de crédito.");
    }
};


function calcTotals(invoices: Invoice[]): TotalsPayment {
    return invoices.reduce(
        (acc: TotalsPayment, invoice) => {
            if (parseInt(invoice.diavenc) < 15) {
                acc.total1Quinze += parseFloat(invoice.total);
                if (invoice.pago === true) acc.total1QuinzePago += parseFloat(invoice.total);
            } else {
                acc.total2Quinze += parseFloat(invoice.total);
                if (invoice.pago === true) acc.total2QuinzePago += parseFloat(invoice.total);
            }
            return acc;
        },
        {
            total1Quinze: 0,
            total2Quinze: 0,
            total1QuinzePago: 0,
            total2QuinzePago: 0
        });
}



export function convertToInvoice(invoiceDto: InvoiceDto): Invoice {
    const collumOrigem = parseInt(invoiceDto.diavenc) > 14 ? "quin2desp" : "quin1desp";

    return {
        id: invoiceDto.id ?? '',
        title: invoiceDto.descricao,
        avatar: invoiceDto.type === TypeCredit.DESPESAFIXA ? "mdi:graph-pie" : invoiceDto.emissor,
        diavenc: invoiceDto.diavenc,
        diafech: invoiceDto.diafech,
        emissor: invoiceDto.emissor,
        total: invoiceDto.totalFatura,
        pago: false,
        columnId: collumOrigem,
        columnOrigem: collumOrigem,
    };
}