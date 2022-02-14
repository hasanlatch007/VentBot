FROM node:16.13-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app
COPY . .
RUN yarn run tsc

FROM node:16.13-alpine
RUN apk add --no-cache libc6-compat
# Create app directory
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/yarn.lock ./yarn.lock
COPY --from=builder /usr/src/app/build ./build
COPY /deployment/docker-entrypoint.sh ./docker-entrypoint.sh

ARG BOT_TOKEN
ARG GUILD_ID
ARG PRISMA_DATABASE_URL
ARG VCS_REF=0

ENV BOT_TOKEN $BOT_TOKEN
ENV GUILD_ID $GUILD_ID
ENV PRISMA_DATABASE_URL $PRISMA_DATABASE_URL
ENV VCS_REF $VCS_REF


ENTRYPOINT ["./docker-entrypoint.sh"]