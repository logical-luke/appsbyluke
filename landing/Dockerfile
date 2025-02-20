FROM node:22.14.0
WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4321
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4321"]