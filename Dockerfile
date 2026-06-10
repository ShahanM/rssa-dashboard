FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 3339

CMD ["npm", "run", "dev", "--", "--host"]
