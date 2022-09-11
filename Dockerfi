FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "build" ]
ENTRYPOINT [ "npm", "run", "build-fonts" ]

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY ./app/_site/* ./
ENTRYPOINT ["nginx", "-g", "daemon off;"]