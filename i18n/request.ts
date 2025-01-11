// import {notFound} from 'next/navigation';
// import {getRequestConfig} from 'next-intl/server';
// import {routing} from './routing';
 
// export default getRequestConfig(async ({locale}) => {
//   // Validate that the incoming `locale` parameter is valid
//   if (!routing.locales.includes(locale as any)) notFound();
 
//   return {
//     messages: (await import(`../messages/${locale}.json`)).default
//   };
// });

import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Aguarda a resolução da Promise e verifica se requestLocale é válido
  const locale = await requestLocale; // Resolve a Promise

  if (!locale || !routing.locales.includes(locale)) {
    notFound();
  }

  // Carrega as mensagens do locale correspondente
  try {
    const messages = await import(`../messages/${locale}.json`);
    return {
      messages: messages.default
    };
  } catch (error) {
    // Se houver erro ao carregar as mensagens, retorna 404
    notFound();
  }
});
