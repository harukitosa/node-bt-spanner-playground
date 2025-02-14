FROM node:18-alpine

WORKDIR /usr/src/app

# package.json と package-lock.json（または yarn.lock）のコピー
COPY package*.json ./
RUN npm install

# ソースコードをコピー（ただし、開発中はホストのボリュームマウントが優先される）
COPY . .

# 開発用の起動コマンド
CMD ["npx", "nodemon", "--watch", "src", "--ext", "ts", "--exec", "ts-node", "src/index.ts"]
