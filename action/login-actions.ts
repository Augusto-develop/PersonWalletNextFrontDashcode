'use client';

const url_dominio = process.env.NEXT_PUBLIC_DOMINIO_API_URL;

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

export const handleLogin = async (email: string, password: string): Promise<string | null> => {
    // const url_dominio = 'https://seu-dominio.com'; // Substitua pelo domínio correto

    const res = await fetch(`${url_dominio}/auth/login`, {
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

    const { token } = await res.json();

    // Armazena o token no localStorage (ou em cookies para maior segurança)
    localStorage.setItem('auth_token', token);

    return token;

    // console.log('Login realizado com sucesso!');
    // Aqui você pode redirecionar ou realizar outras ações
};



export default async function fetchWithAuth(url_recurso: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth_token');

    // Adicionar o token às requisições
    if (token) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    let response = await fetch(url_dominio + url_recurso, options);

    // Verifica se o token expirou
    if (response.status === 401) {
        console.log('Access token expired. Trying to refresh...');

        // Tenta obter um novo access token
        //const refreshResponse = await fetch('/api/auth/refresh', { method: 'POST' });
        await handleLogin('augustogomes0822@gmail.com', '123456');

        const newToken = localStorage.getItem('auth_token');
        if (newToken) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
            };
            response = await fetch(url_dominio + url_recurso, options);
        }
    }

    return response;
}