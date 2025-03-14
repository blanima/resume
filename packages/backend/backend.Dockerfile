FROM node:18-alpine3.16 as base 

FROM base as builder
ADD . /app
WORKDIR /app

# Copy manifest and install dependencies for BE
COPY package*.json ./
RUN npm install
RUN npm run build -w @resume/core
RUN npm run build -w @resume/backend

FROM base as app
# base setup
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Core package

WORKDIR /app/packages/core
COPY --from=builder /app/packages/core/package*.json ./
COPY --from=builder /app/packages/core/dist ./dist

#backend package
WORKDIR /app/packages/backend
COPY --from=builder /app/packages/backend/package*.json ./
COPY --from=builder /app/packages/backend/config ./config
COPY --from=builder /app/packages/backend/node_modules ./node_modules
COPY --from=builder /app/packages/backend/dist ./dist

EXPOSE 3000
CMD [ "npm", "start" ]
