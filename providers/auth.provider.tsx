'use client';

import { SessionProvider } from "next-auth/react";
import React, { useState, useEffect, useContext, createContext } from 'react';
import { Dialog } from '@headlessui/react'; // Ou qualquer outra biblioteca de dialog que preferir
import { handleLogin } from "@/action/login-actions";
import { toast } from "sonner"
import { useRouter } from 'next/navigation';

interface AuthProviderProps {
    children: React.ReactNode;
}

// interface AuthContextType {
//     user: any | null;
//     login: (email: string, password: string) => Promise<void>;
//     logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // useEffect(() => {
    //     // Recupera o token do localStorage
    //     const token = localStorage.getItem('auth_token');

    //     if (token) {
    //         try {

    //             // setIsDialogOpen(true);

    //             // Decodifica o token e verifica sua expiração
    //             // const decodedToken: { exp: number } = jwt_decode(token);
    //             // const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos

    //             // // Se o token expirou, abre o dialog
    //             // if (decodedToken.exp < currentTime) {
    //             //     setIsDialogOpen(true);
    //             // }
    //         } catch (error) {
    //             console.error("Erro ao decodificar o token", error);
    //         }
    //     } else {
    //         // Se o token não existir, redirecionar ou tratar caso de usuário não autenticado
    //         console.log("Token não encontrado");
    //     }
    // }, []); // A verificação é feita uma vez, quando o componente é montado

    const login = async (email: string, password: string) => {

        handleLogin(email, password).then((token) => {
            if (token) {
                // Se o token for retornado, redireciona para o dashboard

                // const response = NextResponse.json({ message: 'Login bem-sucedido' });
                // setCookieToken(response, token);

                // localStorage.setItem('auth_token', token);

                router.push('/dashboard');
                toast.success("Successfully logged in");
            }
        }).catch((err: unknown) => {
            if (err instanceof Error) {
                toast.error(err.message); // Exibe a mensagem de erro
            } else {
                toast.error("An unexpected error occurred.");
            }
        });
    };


    const logout = async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    // const handleLogin = (password: string) => {
    //     // Enviar a senha para o servidor para renovar o token
    //     // Exemplo de requisição para renovar o token (ajuste conforme necessário)
    //     fetch('/auth/renew', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ password })
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             // Supondo que o servidor retorne um novo token
    //             const newToken = data.token;
    //             if (newToken) {
    //                 // Atualize o token no localStorage
    //                 localStorage.setItem('auth_token', newToken);
    //                 setIsDialogOpen(false); // Fechar o dialog após renovação
    //             } else {
    //                 console.error('Erro ao renovar o token');
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Erro ao renovar o token', error);
    //         });
    // };

    const handleCloseDialog = () => setIsDialogOpen(false);

    // const ProtectedChildren = withProtectedRoute(() => <>{children}</>);


    // {isDialogOpen && (
    //     <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
    //         <Dialog.Overlay />
    //         <Dialog.Title>Token Expirado</Dialog.Title>
    //         <Dialog.Description>
    //             Seu token de autenticação expirou. Por favor, insira sua senha para continuar.
    //         </Dialog.Description>
    //         <div>
    //             <input
    //                 type="password"
    //                 placeholder="Digite sua senha"
    //                 onChange={(e) => setPassword(e.target.value)}
    //             />
    //             {/* <button onClick={() => handleLogin(password)}>Entrar</button> */}
    //             <button onClick={handleCloseDialog}>Cancelar</button>
    //         </div>
    //     </Dialog>
    // )}

    return (
        // <AuthContext.Provider value={{ user, login, logout }}>
        <SessionProvider>
            {children}
            {/* Dialog de Solicitação de Senha */}
        </SessionProvider>
        // </AuthContext.Provider >
    );
};

export default AuthProvider;
// Hook para acessar o contexto
// export const useAuth = (): AuthContextType => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth deve ser usado dentro de um AuthProvider');
//     }
//     return context;
// };
