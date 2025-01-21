import { AuthResponse } from "@/lib/model/auth-response";
import { AuthResponseDto } from "./types.schema.dto";
import { getSession } from "next-auth/react";

const url_dominio = process.env.NEXT_PUBLIC_PERSONWALLET_API_URL;
const url_dominio_network_docker = process.env.NEXT_PUBLIC_PERSONWALLET_API_URL_DOCKER_NETWORK;

// const handleLogin = async () => {
//     const res = await fetch(url_dominio + '/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             "email": "augustogomes0822@gmail.com",
//             "password": "123456"
//         }),
//     });

//     if (!res.ok) {
//         const { error } = await res.json();
//         throw new Error(error);
//     }

//     const { token } = await res.json();
//     // Armazena o token no localStorage (ou cookies para maior segurança)
//     localStorage.setItem('auth_token', token);

//     console.log('Login successful!');
//     // Redirecionar ou realizar outras ações
// };

export const handleLogin = async (email: string, password: string): Promise<AuthResponse> => {

  const res = await fetch(`${url_dominio_network_docker}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Erro desconhecido durante o login');
  }

  const response: AuthResponseDto = await res.json();
  return convertDtoToAuthResponse(response);
};

export default async function fetchWithAuth(
  url_recurso: string,
  options: RequestInit = {}
): Promise<Response> {

  const session = await getSession();

  // Redirecionar se não houver sessão
  if (!session) {
    if (typeof window !== "undefined") {
      window.location.replace("/");
    }
    throw new Error("Sessão não encontrada. Redirecionando para a página inicial.");
  }

  const pwApiToken = session.user?.pwApiToken;

  // Adicionar o token às requisições
  if (pwApiToken) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${pwApiToken}`,
    };
  }

  try {
    const response = await fetch(`${url_dominio}${url_recurso}`, options);

    // Verifica se o token expirou e redireciona para a página de login
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.replace("/");
      }
      throw new Error("Token de acesso expirado. Redirecionando para a página inicial.");
    }

    return response; // Retorna a resposta válida
  } catch (error) {

    if (error instanceof Error) {
      console.error("Erro ao fazer a requisição:", error.message);
    } else {
      console.error("Erro desconhecido:", error);
    }
    throw error;
  }
}


export function convertDtoToAuthResponse(authResponseDto: AuthResponseDto): AuthResponse {
  return {
    id: authResponseDto.id,
    name: authResponseDto.name,
    token: authResponseDto.token,
    expiresIn: authResponseDto.expiresIn,
  };
}