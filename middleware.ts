import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isRouteMatch } from './lib/route';
import { ConfigRoutes } from './config/routes';

export default function middleware(request: NextRequest) {  

  const session = request.cookies.get('authjs.session-token'); 

  const pathname = request.nextUrl.pathname;
  const { isPublicRoute, isProtectedRoute } = isRouteMatch(ConfigRoutes, pathname);

  // Se o usuário não tem token e tenta acessar uma página protegida, redireciona para o login
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Se o usuário já tem token e tenta acessar a página de login, redireciona para o dashboard
  if (session && isPublicRoute) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Se o usuário está tentando acessar uma rota pública sem token, permite o acesso
  if (isPublicRoute && !session) {
    return NextResponse.next(); // Permite o acesso à página de login ou outra página pública
  }
  // Se o token está presente ou a rota é protegida e o usuário tem token, permite o acesso
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/.',
    '/categories',
    '/credits/cashpayments',
    '/credits/creditcards',
    '/credits/financings',
    '/credits/lendings',
    '/credits',
    '/credits/recurrings',
    '/dashboard',
    '/expenses',
    '/payment',
    '/revenues',
    '/wallets'
  ],
  exclude: [
    '/_next/static/*',
    '/api/*',
    '/images/*',
    '/css/*',
    '/js/*',
  ],
};
