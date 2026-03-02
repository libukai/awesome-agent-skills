# httpYac 语法速查表

## 基本结构
```http
### 请求分隔符（必需）

# @name requestName          # 请求名称（用于引用）
# @description 描述          # 悬停可见的详细描述
GET {{baseUrl}}/endpoint
Authorization: Bearer {{token}}
Content-Type: application/json

{ "data": "value" }

{{  # 响应后脚本
  exports.nextId = response.parsedBody.id;
}}
```

## 变量定义
```http
### 文件顶部定义
@baseUrl = {{API_BASE_URL}}
@token = {{API_TOKEN}}

### 脚本中定义（请求前）
{{
  exports.userId = "123";  // 供请求中使用
  exports.timestamp = Date.now();
}}

### 响应后存储
{{
  exports.newToken = response.parsedBody.token;
}}
```

## 认证模式

### Bearer Token
```http
GET {{baseUrl}}/api/data
Authorization: Bearer {{token}}
```

### 基础认证
```http
GET {{baseUrl}}/api/data
Authorization: Basic {{username}}:{{password}}
```

### 自动获取 Token
```http
# @name login
POST {{baseUrl}}/oauth/token
Content-Type: application/json

{
  "grant_type": "client_credentials",
  "client_id": "{{clientId}}",
  "client_secret": "{{clientSecret}}"
}

{{
  if (response.statusCode === 200) {
    exports.accessToken = response.parsedBody.access_token;
  }
}}
```

## 测试断言
```http
GET {{baseUrl}}/users

{{
  const assert = require('assert');
  assert.strictEqual(response.statusCode, 200);
  assert.ok(response.parsedBody.data);

  // 使用 Chai
  const { expect } = require('chai');
  test("状态码为 200", () => {
    expect(response.statusCode).to.equal(200);
  });
}}
```

## 环境配置
```json
// .httpyac.json
{
  "environments": {
    "dev": {
      "baseUrl": "http://localhost:3000",
      "token": "{{$processEnv API_TOKEN}}"
    },
    "prod": {
      "baseUrl": "https://api.example.com"
    }
  }
}
```

## 动态变量
```http
{{
  uuid = $uuid;                    // UUID v4
  timestamp = $timestamp;          // Unix 时间戳
  randomInt = $randomInt;          // 随机整数
  datetime = $datetime;            // ISO 时间
}}
```

## 常见错误
- ❌ `exports.baseUrl = process.env.API_URL`  // 错误
- ✅ `@baseUrl = {{API_URL}}`                 // 正确
- ❌ 忘记 `###` 分隔符
- ✅ 每个请求之间用 `###` 分隔