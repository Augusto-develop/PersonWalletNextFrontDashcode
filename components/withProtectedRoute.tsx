'use client';

import { ConfigRoutes } from '@/config/routes';
import { isRouteMatch } from '@/lib/route';
import { useRouter } from 'next/navigation'; // Alterado para 'next/navigation'
import React, { useEffect, useState } from 'react';

const withProtectedRoute = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const HOC = (props: P) => {
        // const { user } = useAuth();
        // const router = useRouter();  // Use router de 'next/navigation'
        // const [isLoading, setIsLoading] = useState(true);

        // const { isPublicRoute, isProtectedRoute } = isRouteMatch(ConfigRoutes);

        // useEffect(() => {
        //     if (isProtectedRoute) {
        //         // Garantir que o código esteja sendo executado no cliente
        //         if (typeof window !== 'undefined') {
        //             // Verifique se o usuário está autenticado
        //             if (user === null) {
        //                 router.push('/');  // Redireciona para o login caso não esteja autenticado
        //             } else {
        //                 setIsLoading(false);  // Caso esteja autenticado, pare o carregamento
        //             }
        //         }
        //     }

        // }, [user, router]);

        // Se o estado estiver carregando, renderiza a mensagem de "Loading..."
        // if (isLoading) {
        //     return <div>Loading...</div>;
        // }

        // Se o usuário estiver autenticado, renderiza o WrappedComponent
        return <WrappedComponent {...props} />;
    };

    return HOC;
};

export default withProtectedRoute;
