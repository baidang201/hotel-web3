# Scaffold-ETH 2 项目架构

## 1. 项目概述

这是一个用于快速开发以太坊DApp的全栈开发框架，采用monorepo结构，包含智能合约开发和前端开发环境。

## 2. 技术栈

### 2.1 智能合约
- Solidity ^0.8.0
- Hardhat
- TypeChain
- OpenZeppelin
- Ethers.js

### 2.2 前端
- Next.js 14
- RainbowKit
- wagmi/viem
- TailwindCSS
- DaisyUI

### 2.3 开发工具
- TypeScript
- Yarn Workspaces
- ESLint
- Prettier
- Husky

## 3. 项目结构 
./
├── packages/
│ ├── hardhat/ # 智能合约开发环境
│ │ ├── contracts/ # 智能合约源码
│ │ ├── deploy/ # 部署脚本
│ │ ├── test/ # 测试文件
│ │ └── scripts/ # 工具脚本
│ │
│ └── nextjs/ # 前端应用
│ ├── app/ # Next.js 页面
│ ├── components/ # React组件
│ ├── hooks/ # 自定义Hooks
│ ├── services/ # Web3服务
│ └── utils/ # 工具函数
│
├── package.json # 工作区配置
└── README.md # 项目文档


## 4. 核心功能模块

### 4.1 智能合约开发
- 合约编写与编译
- 自动化测试
- 部署脚本
- Gas优化
- 合约验证

### 4.2 Web3集成
- 多钱包支持
- 网络切换
- 合约交互
- 事件监听
- 交易处理

### 4.3 开发工具
- 合约调试界面
- 区块浏览器
- 本地开发链
- 自动化测试
- 类型生成

## 5. 开发流程

### 5.1 智能合约
1. 编写合约代码
2. 运行测试
3. 本地部署
4. 合约验证

### 5.2 前端开发
1. 配置环境
2. 开发页面
3. 集成Web3
4. 测试部署

## 6. 注意事项

### 6.1 安全考虑
- 合约安全检查
- 权限控制
- 输入验证
- 错误处理

### 6.2 性能优化
- 合约Gas优化
- 前端性能优化
- 缓存策略
- 状态管理