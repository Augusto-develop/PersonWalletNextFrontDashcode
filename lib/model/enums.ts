export enum TypeCredit {
    CARTAO = "CARTAO",
    EMPRESTIMO = "EMPRESTIMO",
    FINANCIAMENTO = "FINANCIAMENTO",
    DESPESAFIXA = "DESPESAFIXA",
    AVISTA = "AVISTA"
}

export const TypeCreditText = {
    [TypeCredit.CARTAO]: "Cartão",
    [TypeCredit.EMPRESTIMO]: "Empréstimo",
    [TypeCredit.FINANCIAMENTO]: "Financiamento",
    [TypeCredit.DESPESAFIXA]: "Despesa Fixa",
    [TypeCredit.AVISTA]: "À Vista",
};

export enum Bandeira {
    VISA = "VISA",
    MASTERCARD = "MASTERCARD"
}

export const BandeiraText = {
    [Bandeira.VISA]: "Visa",
    [Bandeira.MASTERCARD]: "Mastercard",
};

export enum Emissor {
    ITAU = "ITAU",
    BRADESCO = "BRADESCO",
    BANCOBRASIL = "BANCOBRASIL",
    SANTANDER = "SANTANDER",
    CAIXA = "CAIXA",
    NUBANK = "NUBANK",
    MERCADOPAGO = "MERCADOPAGO",
    ATACADAO = "ATACADAO",
    NOVUCARD = "NOVUCARD",
    OUZE = "OUZE",
    RIACHUELO = "RIACHUELO",
    BRASILCARD = "BRASILCARD",
    NEON = "NEON",
    C6BANK = "C6BANK",
    MIDWAY = "MIDWAY",
    BANCOPAN = "BANCOPAN",
}

export const EmissorText = {
    [Emissor.ITAU]: "Itaú",
    [Emissor.BRADESCO]: "Bradesco",
    [Emissor.BANCOBRASIL]: "Banco do Brasil",
    [Emissor.SANTANDER]: "Santander",
    [Emissor.CAIXA]: "Caixa Econômica",
    [Emissor.NUBANK]: "Nubank",
    [Emissor.MERCADOPAGO]: "Mercado Pago",
    [Emissor.ATACADAO]: "Atacadão",
    [Emissor.NOVUCARD]: "NovoCard",
    [Emissor.OUZE]: "Ouze",
    [Emissor.RIACHUELO]: "Riachuelo",
    [Emissor.BRASILCARD]: "BrasilCard",
    [Emissor.NEON]: "Neon",
    [Emissor.C6BANK]: "C6 Bank",
    [Emissor.MIDWAY]: "Midway",
    [Emissor.BANCOPAN]: "Banco Pan",
};