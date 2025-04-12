FROM node:20-slim
WORKDIR /realtme-track

COPY . .
RUN npm install
EXPOSE 5000

RUN useradd rtlt
USER rtlt

CMD [ "npm", "start" ]