# Dockerfile (prod)
FROM node:20

WORKDIR /app

# Instalar LibreOffice y dependencias necesarias
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-calc \
    libreoffice-writer \
    fonts-dejavu-core \
    libx11-6 \
    libxext6 \
    libxrender1 \
    libxinerama1 \
    libfontconfig1 \
    libfreetype6 \
    libcups2 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "src/server.js"]
