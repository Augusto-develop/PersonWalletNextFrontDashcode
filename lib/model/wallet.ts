import { IconAvatar } from "./types";

export type Wallet = {
  id: string;
  descricao: IconAvatar;
  active: boolean;
};

export type WalletOption = {
  label: string;
  value: string;
  avatar: string;
};

export type WalletSaldo = {
  id: string;
  descricao: IconAvatar;
  saldo: string;
};