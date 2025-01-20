const fs = require('fs');
const path = require('path');

// Diretório principal das páginas do Next.js
const appDir = path.join(process.cwd(), 'app');

// Função para verificar se uma linha contém uma anotação
function getRouteAnnotation(fileContent) {
  const lines = fileContent.split('\n');
  for (const line of lines) {
    if (line.includes('@route-public')) return 'public';
    if (line.includes('@route-protected')) return 'protected';
  }
  return null; // Sem anotação
}

// Função para escanear arquivos e coletar rotas com base nas anotações
function scanRoutes(dir, basePath = '') {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    const routeName = entry.name.replace(/\.(tsx|js)$/, '');

    if (entry.isDirectory()) {
      return scanRoutes(fullPath, path.join(basePath, routeName));
    }

    if (entry.isFile() && /\.(tsx|js)$/.test(entry.name)) {
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      const annotation = getRouteAnnotation(fileContent);

      if (annotation) {
        let routePath = path.join(basePath, routeName === 'page' ? '' : routeName);

        routePathFinish = `/${routePath}`;

        if (routePathFinish.includes('/(protected)')) {
          routePathFinish = routePathFinish.replace('/(protected)', '');
        }

        return { route: `${routePathFinish}`, type: annotation };
      }
    }

    return [];
  });
}

// Escaneia todas as rotas no diretório `app`
const allRoutes = scanRoutes(appDir);

// Filtra as rotas públicas e protegidas
const publicRoutes = allRoutes.filter((r) => r.type === 'public').map((r) => r.route);
const protectedRoutes = allRoutes.filter((r) => r.type === 'protected').map((r) => r.route);

// Salva o resultado em um arquivo JSON
const outputFile = path.join(__dirname, 'routes.json');
const routes = { publicRoutes, protectedRoutes };
fs.writeFileSync(outputFile, JSON.stringify(routes, null, 2));
console.log('Rotas geradas com sucesso:', routes);



// Junta as rotas públicas e protegidas
const allRoutesArray = [
  ...publicRoutes,
  ...protectedRoutes, 
];

// Caminho do arquivo middleware
const middlewareFile = path.join(process.cwd(), 'middleware.ts');

// Verifica se o arquivo de middleware existe
if (fs.existsSync(middlewareFile)) {
  const middlewareContent = fs.readFileSync(middlewareFile, 'utf-8');

  // Encontra a exportação do config e a parte do matcher
  const configRegex = /export\s+const\s+config\s*=\s*\{([\s\S]*?)\};/;
  const match = middlewareContent.match(configRegex);

  if (match) {
    const configContent = match[1];

    // Extrai o matcher atual do middleware
    const matcherRegex = /matcher:\s*\[([\s\S]*?)\]/;
    const matcherMatch = configContent.match(matcherRegex);

    if (matcherMatch) {
      const currentMatchers = matcherMatch[1]
        .split(',')
        .map((item) => item.trim().replace(/^['"]|['"]$/g, '')) // Remove espaços e aspas
        .filter(Boolean); // Remove entradas vazias

      // Identifica as rotas que não estão no matcher atual
      const newMatchers = allRoutesArray.filter((route) => !currentMatchers.includes(route));

      if (newMatchers.length > 0) {
        // Combina os matchers existentes e novos
        const combinedMatchers = [...currentMatchers, ...newMatchers];

        // Formata os novos matchers com quebras de linha
        const formattedMatchers = combinedMatchers
          .map((route) => `    '${route}'`)
          .join(',\n');

        // Substitui o matcher no conteúdo do middleware
        const updatedConfig = configContent.replace(
          matcherRegex,
          `matcher: [\n${formattedMatchers}\n  ]`
        );

        // Atualiza o conteúdo do middleware com o matcher ajustado
        const updatedMiddleware = middlewareContent.replace(configRegex, `export const config = {${updatedConfig}};`);

        // Salva o arquivo atualizado
        fs.writeFileSync(middlewareFile, updatedMiddleware);
        console.log('Matcher atualizado com as novas rotas!');
      } else {
        console.log('Nenhuma nova rota para adicionar ao matcher.');
      }
    } else {
      console.log('Matcher atual não encontrado no arquivo middleware.');
    }
  } else {
    console.log('Configuração do middleware não encontrada.');
  }
} else {
  console.log('Arquivo de middleware não encontrado.');
}
