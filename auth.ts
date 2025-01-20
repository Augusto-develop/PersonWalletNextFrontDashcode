export const runtime = 'nodejs';

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "./lib/zod";
import { saltAndHashPassword } from "@/lib/password";
import { handleLogin } from "./action/login-actions";
import { AuthResponse } from "./lib/model/auth-response";
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface User {
        id?: string | undefined
        email?: string | null | undefined
        pwApiToken: string
        name?: string | null | undefined
        // cognitoGroups: string[]
        // accessToken: string
        // refreshToken: string
        // idToken: string
        // exp: number
        // role: string
    }

    interface Session {
        user: User & DefaultSession["user"]
        expires: string
        error: string
    }
}

export const { handlers, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text", placeholder: "example@domain.com" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    const { email, password } = credentials as {
                        email: string; password: string
                    };

                    // console.log("Email:", email);
                    // console.log("Senha:", password);
                    // await signInSchema.parseAsync({ email, password });

                    // Gerar hash da senha (se necessário)
                    // const pwHash = await saltAndHashPassword(password);                      

                    const authResponse: AuthResponse = await handleLogin(email, password);

                    if (!authResponse || !authResponse.token) {
                        throw new Error("Invalid credentials.");
                    }

                    return {
                        id: authResponse.id,
                        name: authResponse.name,
                        email: email,
                        pwApiToken: authResponse.token,
                    };

                } catch (error) {
                    if (error instanceof ZodError) {
                        return null;
                    }
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Adicionar dados do usuário e token da API ao JWT
            if (user) {
                token.id = user.id as string;
                token.email = user.email as string;
                token.pwApiToken = (user as any).pwApiToken; // Adiciona o token da API   
            }
            return token;
        },
        async session({ session, token }) {
            // Transferir dados do token para a sessão
            if (token) {
                session.user = {
                    ...session.user,
                    id: String(token.id || ""),
                    email: token.email || "",
                    pwApiToken: String(token.pwApiToken || ""),
                }
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET, // Variável de ambiente para segurança
    session: {
        strategy: "jwt", // Usar JWT para sessões
        maxAge: 1 * 1 * 1 * 60, // Expiração do JWT em segundos
    },
    cookies: {
        sessionToken: {
            name: "authjs.session-token",
            options: {
                httpOnly: true,  // O cookie só é acessível via HTTP, não no JavaScript
                secure: process.env.NODE_ENV === "production",  // Só envia o cookie via HTTPS em produção
                sameSite: "strict",  // Impede que o cookie seja enviado em requisições de outros sites
                // maxAge: 30 * 24 * 60 * 60,
                maxAge: 1 * 1 * 1 * 60,
                path: "/",
            },
        },
    },
});
