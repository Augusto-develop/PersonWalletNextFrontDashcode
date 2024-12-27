import { createOptionsCreditCards } from "@/action/creditcard-actions";
import { createOptionsFinancing } from "@/action/financing-actions";
import { createOptionsLending } from "@/action/lending-actions";
import { createOptionsCashPayment } from "@/action/cashpayment-actions";
import { TypeCredit } from "@/lib/model/enums";
import {
    CashPaymentOption,
    CreditCardOption,
    FinancingOption,
    LendingOption,
    RecurringOption
} from "@/lib/model/types";


export type CreditOption = {
    label: string;
    value: string;
    avatar: string;
    type?: string;
};

export interface GroupedCreditOption {
    label: string;
    options: CreditOption[];
}

export const createOptionsGroupCredit = async (): Promise<GroupedCreditOption[]> => {

    const creditcardOptions: CreditCardOption[] = await createOptionsCreditCards();

    const financingOptions: FinancingOption[] = await createOptionsFinancing();

    const lendingOptions: LendingOption[] = await createOptionsLending();

    const recurringOptions: RecurringOption[] = [{
        label: "Recurrings",
        value: TypeCredit.DESPESAFIXA.toString(),
        avatar: "mdi:graph-pie"
    }]

    const cashPaymentOptions: CashPaymentOption[] = await createOptionsCashPayment();

    const groupedOptions: GroupedCreditOption[] = [
        {
            label: "Credit Cards",
            options: creditcardOptions,
        },
        {
            label: "Financings",
            options: financingOptions,
        },
        {
            label: "Lendings",
            options: lendingOptions,
        },
        {
            label: "Recurrings",
            options: recurringOptions,
        },
        {
            label: "Cash Payments",
            options: cashPaymentOptions,
        },
    ];

    return groupedOptions;
}

export function findCreditOptionByValue(groupCreditOptions: GroupedCreditOption[], value: string): CreditOption | null {
    for (const creditOption of groupCreditOptions) {
        for (const option of creditOption.options) {
            if (option.value === value) {
                return option;
            }
        }
    }
    return null;
}