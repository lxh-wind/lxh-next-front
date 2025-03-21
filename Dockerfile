# 1. 使用 Node.js 作为基础镜像
FROM node:18

# 2. 设置工作目录
WORKDIR /app

# 3. 复制 package.json 和 package-lock.json
COPY package*.json ./

# 4. 安装依赖
RUN npm install

# 5. 复制项目代码
COPY . .

# 6. 构建 Next.js 应用
RUN npm run build

# 7. 设置环境变量（生产模式）
ENV NODE_ENV=production

# 8. 暴露端口（Next.js 默认运行在 3000 端口）
EXPOSE 3000

# 9. 启动 Next.js
CMD ["npm", "start"]
