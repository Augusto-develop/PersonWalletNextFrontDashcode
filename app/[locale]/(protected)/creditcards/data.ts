import { faker } from "@faker-js/faker";
import { GetServerSideProps } from 'next';
import { useEffect, useState } from "react";

type Credit = {
  id: string;
  descricao: string;
  type: string;
  diavenc: string;
  valorcredito: string;
  valorparcela: string;
  diafech: string;
  emissor: string;
  bandeira: string;
};

export type CreditCard = {
  id: string;
  title: string;
  avatar: string;
  diavenc: string;
  diafech: string;
  limite: string;
  progress: int;
};

export const defaultCreditCards = [
  {
    id: "c06d48bf-7f35-4789-b71e-d80fee5b430f",
    title: "NUBANK [AUG]",
    avatar: "Nu",
    desc: "",
    diavenc: "21",
    diafech: "14",
    progress: 95,
  },
  {
    id: "c06d48bf-7f35-4789-b71e-d80fee5b430f",
    title: "SANTANDER",
    avatar: "Santander",
    desc: "",
    diavenc: "21",
    diafech: "14",
    progress: 95,
  }  
];


export const getCreditCards = async (): Promise<CreditCard[]> => {

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NjVkYTBhZC1lNDFiLTQ0Y2ItODJiYS0wNjc5OTdkNGI4NWUiLCJ1c2VybmFtZSI6IkF1Z3VzdG8gZGUgQ2FzdHJvIEdvbWVzIiwiaWF0IjoxNzM0MDU2OTEwLCJleHAiOjE3MzQwNjA1MTB9.IaCNYYCHpAxMJoxKqU4qjyotu_iq-Rn3rklhyYLHd0A";

  const res = await fetch('http://localhost:3000/credito', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  let newData: CreditCard[] = [];

  if (res.ok) {
    const data: Credit[] = await res.json();

    newData = data.map((item) => ({
      id: item.id,
      title: item.descricao,
      avatar: item.emissor,
      diavenc: item.diavenc,
      diafech: item.diafech,
      limite: item.valorcredito,
      progress: 90,  // Pode ajustar conforme necessário
    }));    
  } else {
    console.error('Erro ao buscar os dados');
  }
  return newData;
};

export const getProjectById = async (id: string) => {
  return defaultCreditCards.find(project => project.id === id)
}

interface ProjectNav {
  label: string
  href: string
  active: boolean
}

export function getProjectNav(pathname: string): ProjectNav[] {
  return [
    // {
    //   label: 'grid view',
    //   href: "/app/projects/grid",
    //   active: pathname === "/app/projects/grid",
    // },
    // {
    //   label: 'list view',
    //   href: "/app/projects/list",
    //   active: pathname === "/app/projects/list",
    // }
  ]
}

export type Project = (typeof defaultCreditCards)[number]

function convertToNumeric(value) {
  if (!value) return null;

  // Remove "R$", espaços e pontos
  let numericValue = value.replace(/R\$|\s|\./g, "");

  // Substitui a vírgula decimal por um ponto
  numericValue = numericValue.replace(",", ".");

  // Converte para número de ponto flutuante
  return parseFloat(numericValue);
}

function addLeadingZeros(value, length) {
  return value.toString().padStart(length, "0");
}

export const handleSubmit = async (data) => {
  // Prepara o payload
  const payload = {
    descricao: data.descricao,
    limite: convertToNumeric(data.limite),
    emissor: data.emissor.value,
    bandeira: data.bandeira.value,
    vencimento: addLeadingZeros(data.vencimento.value, 2),
    fechamento: addLeadingZeros(data.fechamento.value, 2),
  };

  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NjVkYTBhZC1lNDFiLTQ0Y2ItODJiYS0wNjc5OTdkNGI4NWUiLCJ1c2VybmFtZSI6IkF1Z3VzdG8gZGUgQ2FzdHJvIEdvbWVzIiwiaWF0IjoxNzM0MDU2OTEwLCJleHAiOjE3MzQwNjA1MTB9.IaCNYYCHpAxMJoxKqU4qjyotu_iq-Rn3rklhyYLHd0A";

    const response = await fetch('http://localhost:3000/credito', {
      method: "POST",
      headers: {        
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Sucesso:", result);
    } else {
      console.error("Erro ao enviar:", response.statusText);
    }
  } catch (error) {
    console.error("Erro de requisição:", error);
  }
};

