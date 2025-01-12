// import {createSharedPathnamesNavigation} from 'next-intl/navigation';
// import {locales} from '@/config';

// export const {Link, redirect, usePathname, useRouter} =
//   createSharedPathnamesNavigation({locales,});

// Marque este componente como um Client Component, se necessário
'use client';

import { useRouter, usePathname } from 'next/navigation';  // Use usePathname do next/navigation
import { locales } from '@/config';

export const useCustomRouter = () => {
    const router = useRouter();
    const pathname = usePathname(); // Obtém o pathname diretamente

    // Função para redirecionamento
    const redirect = (path: string) => {
        router.push(path);
    };

    // Função para verificar se o locale é válido
    const isValidLocale = (locale: string) => {
        return locales.includes(locale);
    };

    return { redirect, pathname, isValidLocale };
};