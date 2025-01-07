'use client';
import fetchWithAuth from "./login-actions";
import { WalletDto, WalletSaldoDto } from "@/action/types.schema.dto";
import {Wallet, WalletOption, WalletSaldo } from "@/lib/model/types";

export const getWallets = async (): Promise<Wallet[]> => {

    const res = await fetchWithAuth("/carteira", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: Wallet[] = [];

    if (res.ok) {
        const data: WalletDto[] = await res.json();

        newData = data.map((item) => (convertDtoToWallet(item)));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const getSaldoWallets = async (): Promise<WalletSaldo[]> => {

    const res = await fetchWithAuth("/carteira/saldo", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let newData: WalletSaldo[] = [];

    if (res.ok) {
        const data: WalletSaldoDto[] = await res.json();

        newData = data.map((item) => (convertDtoToWalletSaldo(item)));
    } else {
        console.error('Erro ao buscar os dados');
    }
    return newData;
};

export const createWallet = async (payload: WalletDto): Promise<WalletDto | undefined> => {
    
    delete payload.id;

    const res = await fetchWithAuth("/carteira", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const newWalletDto: WalletDto = await res.json();        
        return newWalletDto;
    } 

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const editWallet = async (payload: WalletDto): Promise<WalletDto | undefined> => {
    
    const res = await fetchWithAuth("/carteira/" + payload.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

    if (res.ok) {
        const newWalletDto: WalletDto = await res.json();        
        return newWalletDto;
    } 

    // console.error("Erro ao enviar:", response.statusText)
    return undefined;
};

export const deleteWallet = async (id: string): Promise<Response> => {
    const res = await fetchWithAuth(`/carteira/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res;
};

export function convertDtoToWallet(walletDto: WalletDto): Wallet {
    return {
        id: walletDto.id ?? '',
        descricao: {
            text: walletDto.descricao,
            avatar: walletDto.emissor,
        },        
        active: walletDto.ativo
    };
}

export function convertDtoToWalletSaldo(walletDto: WalletSaldoDto): WalletSaldo {
    return {
        id: walletDto.id ?? '',
        descricao: {
            text: walletDto.descricao,
            avatar: walletDto.emissor,
        },        
        saldo: walletDto.saldo.toString()
    };
}

export const createOptionsWallets = async (): Promise<WalletOption[]> => {

    const wallets: Wallet[] = await getWallets();

    const walletOptions: WalletOption[] = wallets.map((item) => ({
        label: item.descricao.text,
        value: item.id,
        avatar: item.descricao.avatar,
    })) as WalletOption[];

    return walletOptions;
}