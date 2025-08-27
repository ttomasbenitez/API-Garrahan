# Dockerfile (prod)
FROM node:current

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

COPY . .
CMD ["node", "src/app.js"]