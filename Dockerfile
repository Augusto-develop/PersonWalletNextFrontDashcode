# Use a imagem base oficial do Node.js
FROM node:20-alpine



# Adiciona /usr/local/bin ao PATH (caso não esteja configurado)
ENV PATH=$PATH:/usr/local/bin

#Instale pacotes necessários para o AWS CLI
# RUN apk update && apk add --no-cache \
#     curl \
#     unzip \
#     bash \
#     && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
#     && unzip awscliv2.zip -d /tmp \
#     && /tmp/aws/install \
#     && rm -rf /tmp/aws /tmp/awscliv2.zip


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
