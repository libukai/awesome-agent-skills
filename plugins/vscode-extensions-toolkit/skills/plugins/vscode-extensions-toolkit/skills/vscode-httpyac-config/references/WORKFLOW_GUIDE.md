# httpYac 工作流程指南

## 发现与规划阶段

### 收集用户需求
1. 目标位置（如 `api/`、`tests/`）
2. API 基础 URL 和认证方式
3. 端点分组偏好（单文件 vs 多文件）
4. 环境需求（开发、测试、生产）

### 分析 API 文档
1. 识别基础 URL、认证方法和可用端点
2. 按逻辑模块（资源/功能）分组端点
3. 确定单文件还是多文件结构更合适
4. 向用户提议结构以获得确认

### 结构建议
- **单文件**（<20 端点，简单 API）：所有请求在一个 `.http` 文件中
- **多文件**（20+ 端点，复杂 API）：按资源/功能分组
- **Monorepo 风格**：根 `.http` 文件使用 `@import` 导入功能特定文件

## 文件结构设置

### 单文件结构（推荐 <20 端点）
```
project/
├── .env                          # 密钥（git 忽略）
├── .httpyac.json                 # 环境配置
├── api-collection.http           # 所有请求
└── README.md                     # 使用文档
```

### 多文件结构（推荐 20+ 端点）
```
project/
├── .env                          # 密钥（git 忽略）
├── .httpyac.json                 # 环境配置
├── api/
│   ├── _common.http             # 共享变量和脚本
│   ├── auth.http                # 认证端点
│   ├── users.http               # 用户管理端点
│   ├── orders.http              # 订单管理端点
│   └── README.md                # API 文档
└── tests/
    ├── smoke-tests.http         # 关键路径测试
    └── integration-tests.http   # 完整工作流测试
```

### 命名约定
- 文件：小写连字符（`users.http`、`smoke-tests.http`）
- 共享/通用文件：下划线前缀（`_common.http`、`_setup.http`）
- 请求名称：使用 `# @name requestName` 用于引用链式调用