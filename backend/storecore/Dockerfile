FROM node:18-alpine

WORKDIR /usr/src/app

# Instalar pnpm globalmente
RUN npm install -g pnpm

COPY package.json ./

RUN pnpm install --no-frozen-lockfile

COPY . .

# Para desarrollo local usamos start:dev para tener hot-reloading
CMD ["pnpm", "run", "start:dev"]
