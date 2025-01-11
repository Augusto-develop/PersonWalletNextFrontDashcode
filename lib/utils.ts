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
  if (!value) return 0;

  // Remove "R$", espaços e pontos
  let numericValue = value.replace(/R\$|\s|\./g, "");

  // Substitui a vírgula decimal por um ponto
  numericValue = numericValue.replace(",", ".");

  // Converte para número de ponto flutuante
  return parseFloat(numericValue).toFixed(2);
}

export function addLeadingZeros(value: string | number, length: number) {
  return value.toString().padStart(length, "0");
}

export function convertFloatToMoeda(valor: any, inSigla: boolean = false) {
  const numericValor = parseFloat(valor); // Converte para número
  if (!isNaN(numericValor)) {
    const formatado = `${numericValor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`; // Formata corretamente como moeda
    return inSigla ? `R$ ` + formatado : formatado;
  }
};

export function removePontuacaoValor(valor: any) {
  console.log(valor.replace(/[^\d]/g, ""));
  return valor.replace(/[^\d]/g, "");
}

export function convertDatetimeToDate(isoDate: string): string {
  const date = new Date(isoDate); // Converte a string ISO para um objeto Date
  const day = String(date.getUTCDate()).padStart(2, '0'); // Obtém o dia em UTC
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Obtém o mês em UTC (0-indexado)
  const year = date.getUTCFullYear(); // Obtém o ano em UTC

  return `${day}/${month}/${year}`; // Retorna no formato dd/mm/yyyy
}

export function convertToAmericanDate(date: string): string {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
}

export const months = [
  { label: 'Janeiro', value: '01' },
  { label: 'Fevereiro', value: '02' },
  { label: 'Março', value: '03' },
  { label: 'Abril', value: '04' },
  { label: 'Maio', value: '05' },
  { label: 'Junho', value: '06' },
  { label: 'Julho', value: '07' },
  { label: 'Agosto', value: '08' },
  { label: 'Setembro', value: '09' },
  { label: 'Outubro', value: '10' },
  { label: 'Novembro', value: '11' },
  { label: 'Dezembro', value: '12' },
];

export const getCurrentDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}/${month}/${year}`; // Formato DD/MM/YYYY
};

export const getCurrentYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  return `${year}`;
};

export const getCurrentMonth = () => {
  const now = new Date();
  const month = now.getMonth() + 1;  // Adiciona 1 para obter o mês correto
  return addLeadingZeros(month, 2); // Retorna apenas o mês
};

export function getDayIsoDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, '0');
  return day;
}

export enum CompareFloat {
  IGUAL = "IGUAL",
  MAIOR = "MAIOR",
  MENOR = "MENOR"
}

export function compareFloat(a: number, b: number, epsilon: number = 0.000001): CompareFloat {
  const diferenca = a - b;

  if (Math.abs(diferenca) < epsilon) {
    return CompareFloat.IGUAL;
  } else if (diferenca > 0) {
    return CompareFloat.MAIOR;
  } else {
    return CompareFloat.MENOR;
  }
}

export function calculatePercentage(valor: number, total: number): number {
  if (total === 0) {
    throw new Error("O total não pode ser zero.");
  }

  const percentual = (valor / total) * 100;
  return parseFloat(percentual.toFixed(0));
}

export function calculateValueMaxPixCredito(limite: number, taxa: number = 3.99): number {
  const fator = 1 + (taxa / 100);
  const valorMaximo = limite / fator;
  return parseFloat(valorMaximo.toFixed(2)); // Retorna com duas casas decimais
}