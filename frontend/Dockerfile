FROM node:18-alpine

WORKDIR /usr/src/app

# Instalar pnpm globalmente
RUN npm install -g pnpm

COPY package.json ./

RUN pnpm install --no-frozen-lockfile

COPY . .

# Para React usamos start en desarrollo
CMD ["pnpm", "start"]
