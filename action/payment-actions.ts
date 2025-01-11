'use client';
import fetchWithAuth from "./login-actions";
import { Invoice, ExpensesForPayment, TotalsPaymentExpenses, TotalsPaymentRevenues, Revenue, StatusInvoice, PaymentStatus, Movement } from "@/lib/model/types";
import { InvoiceDto, MovementDto } from "./types.schema.dto";
import { TypeCredit } from "@/lib/model/enums";
import { getRevenues } from "./revenue-actions";
import { convertDtoToMovement } from "./movement-actions";
import { getSaldoWallets } from "./wallet-actions";
import { CompareFloat, compareFloat } from "@/lib/utils";

export const getCreditInvoice = async (
    payload: { mes: string; ano: string }
): Promise<ExpensesForPayment> => {
    try {
        // Construir os parâmetros da URL
        const queryParams = new URLSearchParams({
            mesfat: payload.mes,
            anofat: payload.ano,
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
            totalsExpenses: {
                total1Quinze: 0,
                total2Quinze: 0,
                total1QuinzePago: 0,
                total2QuinzePago: 0
            },
            totalsRevenues: {
                total1Quinze: 0,
                total1QuinzeDiff: 0,
                total2Quinze: 0,
                total2QuinzeDiff: 0
            },
            saldoCarteiras: []
        };

        // Processar resposta bem-sucedida
        if (res.ok) {
            const data: InvoiceDto[] = await res.json();

            // Mapear os dados e calcular os totais
            expensesForPayment.invoices = data.map(convertToInvoice);
            expensesForPayment.totalsExpenses = calcTotalsExpenses(expensesForPayment.invoices);

            const revenues: Revenue[] = await getRevenues({ mes: payload.mes, ano: payload.ano });
            expensesForPayment.totalsRevenues = calcTotalsRevenues(revenues);

            expensesForPayment.totalsRevenues.total1QuinzeDiff =
                expensesForPayment.totalsRevenues.total1Quinze - expensesForPayment.totalsExpenses.total1Quinze;

            expensesForPayment.totalsRevenues.total2QuinzeDiff =
                expensesForPayment.totalsRevenues.total2Quinze - expensesForPayment.totalsExpenses.total2Quinze;

            expensesForPayment.saldoCarteiras = await getSaldoWallets();

        } else {
            console.error("Erro ao buscar os dados:", res.statusText);
        }

        return expensesForPayment;
    } catch (error) {
        console.error("Erro inesperado ao buscar os dados:", error);
        throw new Error("Falha ao carregar as faturas de crédito.");
    }
};


export function calcTotalsExpenses(invoices: Invoice[]): TotalsPaymentExpenses {
    return invoices.reduce(
        (acc: TotalsPaymentExpenses, invoice) => {

            const totalPagoFatura = invoice.pagamentos
                ? invoice.pagamentos.reduce((total, pagamento) => total + parseFloat(pagamento.valor), 0)
                : 0;

            if (parseInt(invoice.diavenc) < 15) {
                acc.total1Quinze += parseFloat(invoice.total);
                acc.total1QuinzePago += totalPagoFatura;
            } else {
                acc.total2Quinze += parseFloat(invoice.total);
                acc.total2QuinzePago += totalPagoFatura;
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

function calcTotalsRevenues(revenues: Revenue[]): TotalsPaymentRevenues {
    return revenues.reduce(
        (acc: TotalsPaymentRevenues, revenue) => {
            if (parseInt(revenue.diareceb) < 15) {
                acc.total1Quinze += parseFloat(revenue.valor);
            } else {
                acc.total2Quinze += parseFloat(revenue.valor);
            }
            return acc;
        },
        {
            total1Quinze: 0,
            total2Quinze: 0,
            total1QuinzeDiff: 0,
            total2QuinzeDiff: 0
        });
}

export function createPaymentStatus(diavenc: string, totalFatura: string, movimentos: Movement[]): PaymentStatus {
    
    
    let  columnOrigem = "";
    if(diavenc === null){
        columnOrigem = "desppag";
    }else{
        columnOrigem = parseInt(diavenc) > 14 ? "quin2desp" : "quin1desp";
    }    
    
    let columnId = columnOrigem;
    const totalPagamento: number = movimentos.reduce(
        (acc, movement) => {
            const valor = typeof movement.valor === 'string' ? parseFloat(movement.valor) : movement.valor;
            return acc += valor;
        }, 0);

    let status: StatusInvoice = StatusInvoice.ABERTA;

    if (totalPagamento > 0) {

        switch (compareFloat(totalPagamento, parseFloat(totalFatura))) {
            case CompareFloat.MENOR:
                status = StatusInvoice.PAGOPARC
                break;
            case CompareFloat.MAIOR:
                status = StatusInvoice.PAGOMAIOR;
                columnId = "desppag";
                break;
            case CompareFloat.IGUAL:
                status = StatusInvoice.PAGO;
                columnId = "desppag";
                break;
            default:
                console.error("Falha comparar float.");
                throw new Error("Falha comparar float.");
        }
    } 

    const invoiceStatus: PaymentStatus = {
        totalPagamento,
        columnId,
        columnOrigem,
        status,
        saldo: (parseFloat(totalFatura) - totalPagamento).toString()
    }

    return invoiceStatus;
}

export function convertToInvoice(invoiceDto: InvoiceDto): Invoice {

    const paymentStatus = createPaymentStatus(invoiceDto.diavenc, invoiceDto.totalFatura,
        invoiceDto.movimentos.map(convertDtoToMovement));

    const totalPago = paymentStatus.totalPagamento;

    let avatar = "";
    switch (invoiceDto.type) {
        case TypeCredit.DESPESAFIXA:
            avatar = "mdi:graph-pie";
            break;
        case TypeCredit.AVISTA:
            avatar = "mdi:cash-multiple";
            break;
        default:
            avatar = invoiceDto.emissor
            break;
    }

    return {
        id: invoiceDto.id ?? '',
        title: invoiceDto.descricao,
        avatar: avatar,
        diavenc: invoiceDto.diavenc,
        diafech: invoiceDto.diafech,
        emissor: invoiceDto.emissor,
        total: invoiceDto.totalFatura,
        pago: totalPago.toString(),
        saldo: (parseFloat(invoiceDto.totalFatura) - totalPago).toString(),
        status: paymentStatus.status,
        columnId: paymentStatus.columnId,
        columnOrigem: paymentStatus.columnOrigem,
        pagamentos: invoiceDto.movimentos.map(convertDtoToMovement)
    };
}