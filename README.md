# Market-Place still in development

# 🛠️ Tecnologías Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)




# Setup node env 
```
$ set NODE_OPTIONS=--openssl-legacy-provider
```

# Start frontend
```
$ cd frontend  
$ pnpm install  
$ pnpm start
```

# Start storecore
```
$ cd backend/storecore
$ pnpm i -g @nestjs/cli  
$ pnpm install  
$ pnpm run start:dev (listening mode)  
$ pnpm start
```

# Start with Docker (Recommended)
Para levantar y administrar toda la arquitectura de forma aislada y unificada (Frontend, Backend, MongoDB, Redis, y Nginx):

**Levantar todos los contenedores (y construir si hay cambios):**
```bash
$ docker-compose up -d --build
```

**Detener los contenedores sin borrarlos:**
```bash
$ docker-compose stop
```

**Detener y eliminar los contenedores:** (las bases de datos no se borran, viven en volúmenes)
```bash
$ docker-compose down
```

**Reconstruir las imágenes de Docker:**
```bash
$ docker-compose build
```



# Screenshots
# Login
![Login](frontend/src/assets/screenshots/login.png)

# verify token
![verifytoken](frontend/src/assets/screenshots/verifytoken.png)

# Resend token
![Resend token](frontend/src/assets/screenshots/resentoken.png)

# Register
![Register](frontend/src/assets/screenshots/register.png)

# Settings
![Settings](frontend/src/assets/screenshots/settings.png)

# DEMO VIDEO
![Demo Video](frontend/src/assets/screenshots/silk.gif)



