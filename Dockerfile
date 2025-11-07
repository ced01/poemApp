FROM node:22

# Optionnel mais recommandé
ENV NODE_ENV=production

# Répertoire de travail
WORKDIR /app

# 1) Copier uniquement les manifests pour profiter du cache
COPY package*.json ./

# 2) Installer les deps (production ou toutes selon ton besoin)
# Pour une app serveur Node :
RUN npm install -g npm@latest --omit=dev
RUN npm ci --only=production 
# Si tu as besoin des devDependencies (ex: build) :
# RUN npm ci

# 3) Copier le code
COPY . .

# 4) Démarrage (assure-toi d’avoir "start" dans package.json)
CMD ["npm", "start"]

EXPOSE 3000
