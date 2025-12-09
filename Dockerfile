# Node.js Dockerfile
# FROM node:24
# WORKDIR /usr/src/app
# COPY package*.json ./
# COPY prisma ./prisma
# RUN npm install
# COPY . .
# RUN npm run build
# EXPOSE 3000
# CMD ["npm", "run", "start:prod"]

FROM oven/bun:1

WORKDIR /usr/src/app
COPY package.json bun.lockb* tsconfig.json ./
RUN bun install
COPY . .
RUN bun x tsc && bun x tsc-alias
EXPOSE 3000
CMD ["bun", "run", "start:prod"]
