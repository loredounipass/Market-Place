FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Para React usamos start en desarrollo
CMD ["npm", "start"]
