// import {defineRouting} from 'next-intl/routing';
// import {createSharedPathnamesNavigation} from 'next-intl/navigation';
//  import {locales} from '@/config';
// export const routing = defineRouting({
//   // A list of all locales that are supported
//   locales: locales,
 
//   // Used when no locale matches
//   defaultLocale: 'en'
// });
 
// // Lightweight wrappers around Next.js' navigation APIs
// // that will consider the routing configuration
// export const {Link, redirect, usePathname, useRouter} =
//   createSharedPathnamesNavigation(routing);

// Removendo a importação do next-intl
// import {defineRouting} from 'next-intl/routing';
// import {createSharedPathnamesNavigation} from 'next-intl/navigation';
// import {locales} from '@/config';

"use client"; 

// Exemplo de navegação convencional do Next.js
import { useRouter } from 'next/navigation'; // Hook do Next.js para navegação

export const useCustomRouter = () => {
  const router = useRouter();

  const goToPage = (path: string) => {
    router.push(path); // Navegar para a página
  };

  const redirectToHome = () => {
    router.push('/'); // Redirecionar para a página inicial
  };

  return {
    goToPage,
    redirectToHome,
  };
};
