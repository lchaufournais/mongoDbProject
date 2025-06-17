FROM node:20

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./
COPY src ./src

RUN npm install
RUN npx tsc
RUN ls -l dist  # <-- Ajoute cette ligne pour voir si le build fonctionne

EXPOSE 3000
CMD ["node", "dist/index.js"]
