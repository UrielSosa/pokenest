<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repo
2. Ejecutar:
```
yarn install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
4. Levantar la db
```
docker-compose up -d
```
5. Copiar y renombrar el **.env.example** a **.env**
6. Completar el **.env** con los valores que se requieren
7. Correr la aplicación
```
yarn start:dev
```
8. Reconstruir la db con el seed
```
http://localhost:3000/api/v2/seed
```

## Stack usado
* Nestjs
* MongoDB

# Production build
1. Crear el archivo ```.env.prod```
2. Llenar las variables de entorno
3. Crear la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```