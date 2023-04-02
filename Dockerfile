FROM node 
WORKDIR /usr/app/
COPY package.json . 
RUN npm install 
RUN npx prisma generate
COPY . . 
EXPOSE 3146 
CMD npm start