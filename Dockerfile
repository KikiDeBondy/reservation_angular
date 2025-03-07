# Étape 1 : Construction de l'application Angular avec Node.js 23
FROM node:23 AS build
WORKDIR /app

# Copier les fichiers de package et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier tout le projet et compiler l'application
COPY . .
RUN npm run build --configuration=production

# Étape 2 : Servir avec Nginx
FROM nginx:alpine
COPY --from=build /app/dist/reservation/browser /usr/share/nginx/html
EXPOSE 80
# Copier la configuration Nginx dans le conteneur
COPY nginx.conf /etc/nginx/nginx.conf
