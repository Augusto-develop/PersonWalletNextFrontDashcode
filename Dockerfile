# Use a imagem base oficial do Node.js
FROM node:20-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /workspaces

# Copie o package.json e o package-lock.json para o contêiner
#COPY package*.json ./

# Instale as dependências do projeto
#RUN npm install

# Copie o restante do código da aplicação para o contêiner
#COPY . .

# Compile o código TypeScript
#RUN npm run build

#RUN npm install

# Exponha a porta que a aplicação irá rodar
EXPOSE 3100

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
