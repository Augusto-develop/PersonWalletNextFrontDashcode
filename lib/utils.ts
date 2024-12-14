import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const hexToRGB = (hex: any, alpha?: number): any => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    return `rgb(${r}, ${g}, ${b})`;
  }
};

export function convertToNumeric(value: string) {
  if (!value) return null;

  // Remove "R$", espaços e pontos
  let numericValue = value.replace(/R\$|\s|\./g, "");

  // Substitui a vírgula decimal por um ponto
  numericValue = numericValue.replace(",", ".");

  // Converte para número de ponto flutuante
  return parseFloat(numericValue);
}

export function addLeadingZeros(value: string | number, length: number) {
  return value.toString().padStart(length, "0");
}

export function convertFloatToMoeda(valor: any, inSigla: boolean = false) {
  const numericValor = parseFloat(valor); // Converte para número
  if (!isNaN(numericValor)) {
    const formatado =  `${numericValor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`; // Formata corretamente como moeda
    return inSigla ? `R$ ` + formatado : formatado;
  }
};

export function removePontuacaoValor(valor: any) {
  console.log(valor.replace(/[^\d]/g, ""));
  return valor.replace(/[^\d]/g, "");
}