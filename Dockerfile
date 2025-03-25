# 使用 Node.js 作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目代码
COPY . .

# 构建 Next.js 应用
RUN npm run build

# 设置环境变量（生产模式）
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动应用使用 pm2-runtime
CMD ["npm", "start"]
