# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json (se existir)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código para o container
COPY . .

# Compila o projeto Next.js para produção
RUN npm run build

# Exposição da porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação Next.js em produção
CMD ["npm", "run", "start"]
