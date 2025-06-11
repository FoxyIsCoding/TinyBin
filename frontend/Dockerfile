FROM node:23-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /tinybin-frontend

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:23-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /tinybin-frontend

COPY --from=build /tinybin-frontend /tinybin-frontend

RUN CI=1 pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["node", "build"]