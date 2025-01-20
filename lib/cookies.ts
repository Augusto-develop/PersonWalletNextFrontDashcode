import { NextResponse } from 'next/server';
import * as cookie from 'cookie';

 export default function setCookieToken(response: NextResponse, token: string): NextResponse{    
    response.headers.set(
        'Set-Cookie',
        cookie.serialize('auth_token', token, {
            httpOnly: true,    // Impede o acesso via JavaScript
            secure: process.env.NODE_ENV === 'production',  // Só envia via HTTPS em produção
            maxAge: 60 * 60 * 24 * 7, // 7 dias de validade
            path: '/',         // Disponível para todo o domínio
        })
    );
    return response;
}

