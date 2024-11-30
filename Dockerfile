FROM node:18.7.0 as builder
WORKDIR /code

COPY package.json package.json
##COPY package-lock.json package-lock.json
RUN npm install

FROM node:18.7.0 as prod
WORKDIR /code

COPY . .
COPY --from=builder /code/node_modules ./node_modules
#configurando la fecha
ENV TZ=America/La_Paz
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
##RUN node server.js
##CMD [ "node", "app.js"]