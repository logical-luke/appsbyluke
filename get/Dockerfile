FROM node:lts AS runtime
WORKDIR /api

COPY . .

RUN npm install
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4173

EXPOSE 4173
CMD ["npm", "run", "dev"]