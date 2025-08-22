# V2EX API Parser

专门用于解析 V2EX 帖子内容的 npm 包，支持提取发帖人信息、ID、标题和回复内容。

## 特性

- 支持解析 V2EX 用户信息页面和帖子页面
- 自动识别页面类型（用户信息页面或帖子页面）
- 支持多页帖子抓取
- 批量用户信息解析
- 提取 Solana 地址信息
- 保持原始换行格式
- 支持 ES Module 和 CommonJS

## 安装

```bash
npm install v2ex-api-parser
```

## 使用方法

### ES Module 语法

```javascript
import V2exParser from "v2ex-api-parser";

const parser = new V2exParser();
const userInfo = await parser.parseUserInfo("username");
const postInfo = await parser.parsePost("123456");
```

### CommonJS 语法

```javascript
const V2exParser = require("v2ex-api-parser");

const parser = new V2exParser();
const userInfo = await parser.parseUserInfo("username");
const postInfo = await parser.parsePost("123456");
```

## 主要功能

### 解析用户信息

```javascript
const userInfo = await parser.parseUserInfo("username");
console.log(userInfo);
// 输出: {
//   type: 'user_info',
//   username: 'username',
//   userId: 'username',
//   memberId: '12345',
//   avatar: 'https://...',
//   signature: '个人签名',
//   joinTime: '2023-01-01',
//   activeRank: '123',
//   isPro: false,
//   socialLinks: {...},
//   solanaAddress: '...',
//   recentReplies: [...]
// }
```

### 解析帖子内容

```javascript
const postInfo = await parser.parsePost("123456");
console.log(postInfo);
// 输出: {
//   type: 'post',
//   postId: '123456',
//   title: '帖子标题',
//   author: {...},
//   content: '帖子内容',
//   replies: [...],
//   statistics: {...}
// }
```

### 多页帖子抓取

```javascript
const postInfo = await parser.parsePost("123456", { useMultiPage: true });
console.log(`总页数: ${postInfo.statistics.totalPages}`);
console.log(`总回复数: ${postInfo.statistics.replyCount}`);
```

### 批量用户解析

```javascript
const usernames = ["user1", "user2", "user3"];
const results = await parser.parseMultipleUsers(usernames, {
  timeout: 15000,
  delay: 1000,
  retryCount: 2,
  showProgress: true,
});
```

### 批量用户解析（带进度回调）

```javascript
const usernames = ["user1", "user2", "user3"];
const results = await parser.parseMultipleUsers(usernames, {
  timeout: 15000,
  delay: 1000,
  retryCount: 2,
  showProgress: true,
  onProgress: (progressInfo) => {
    const { currentIndex, totalUsers, username, status, message, userInfo } =
      progressInfo;

    switch (status) {
      case "start": // 开始解析用户
      case "success": // 解析成功
      case "retry": // 重试中
      case "error": // 最终失败
      case "complete": // 全部完成
        console.log(`[${currentIndex}/${totalUsers}] ${message}`);
        break;
    }
  },
});
```

**进度回调参数说明：**

- `currentIndex`: 当前处理的用户索引（从 1 开始）
- `totalUsers`: 总用户数量
- `username`: 当前处理的用户名
- `status`: 状态（start/success/retry/error/complete）
- `message`: 状态描述信息

### 设置基础 URL

```javascript
parser.setBaseUrl("https://global.v2ex.co");
```

## 模块格式说明

- **CommonJS**: `dist/index.js` - 适用于 Node.js 环境
- **ES Module**: `dist/index.esm.js` - 适用于现代打包工具和 ES 模块环境

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 开发模式构建（监听文件变化）
npm run build:dev

# 运行测试
npm run test:all
```

## 许可证

MIT
