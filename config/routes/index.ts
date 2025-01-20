import routes from './routes.json';

export interface ConfigRoutes {
    publicRoutes: string[],
    protectedRoutes: string[]
}

const { publicRoutes, protectedRoutes } = routes;

export const ConfigRoutes: ConfigRoutes = {
    "publicRoutes": publicRoutes,
    "protectedRoutes": protectedRoutes
}