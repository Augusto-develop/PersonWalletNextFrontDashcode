import type { ConfigRoutes } from "@/config/routes";

// Função para criar os sets de rotas públicas e protegidas
const createRouteSets = (routes: ConfigRoutes) => {
    const publicRouteSet = new Set(routes.publicRoutes.flat());
    const protectedRouteSet = new Set(routes.protectedRoutes.flat());
    return { publicRouteSet, protectedRouteSet };
};

// Função para verificar se a rota é pública ou protegida
export const isRouteMatch = (routes: ConfigRoutes, pathName: string) => {
    const { publicRouteSet, protectedRouteSet } = createRouteSets(routes);
    return {
        isPublicRoute: publicRouteSet.has(pathName),
        isProtectedRoute: protectedRouteSet.has(pathName),
    };
};

// Função para gerar matchers para middleware
export const generateRouteMatchers = (routes: ConfigRoutes) => {
    const { publicRouteSet, protectedRouteSet } = createRouteSets(routes);
    return {
        matchers: Array.from(new Set([...publicRouteSet, ...protectedRouteSet])),
    };
};
