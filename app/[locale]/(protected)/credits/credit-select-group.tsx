import { createOptionsCreditCards, CreditCardOption } from "@/action/creditcard-actions";
import { createOptionsFinancing, FinancingOption } from "@/action/financing-actions";
import { createOptionsLending, LendingOption } from "@/action/lending-actions";
import { RecurringOption } from "@/action/recurring-actions";

export type CreditOption = {
    label: string;
    value: string;
    avatar: string;
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
        value: "DESPESAFIXA",
        avatar: "mdi:graph-pie"        
    }]

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
    ];

    return groupedOptions;
}