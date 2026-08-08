FROM node:18-alpine

WORKDIR /usr/src/app

# Instalar pnpm globalmente
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

# Para React usamos start en desarrollo
CMD ["pnpm", "start"]
