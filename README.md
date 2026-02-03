# 📧 Mailgun CLI 郵件發送工具

使用 Mailgun API 發送郵件的命令列工具,支援自訂模板和批次發送。

## ✨ 功能特色

- 🎨 支援自訂 HTML 郵件模板
- 📮 單封或批次發送
- 👥 收件人群組管理
- 🎯 使用自訂網域 (mail.bocyun.com)
- 🌈 彩色終端輸出,操作體驗佳
- ⚡ 簡單易用的 CLI 介面

## 📦 安裝

### 1. Clone 專案
```bash
git clone https://github.com/你的使用者名稱/mailgun-cli.git
cd mailgun-cli
```

### 2. 安裝依賴
```bash
npm install
```

### 3. 設定環境變數

建立 `.env` 檔案:
```bash
cp .env.example .env
```

編輯 `.env`,填入你的 Mailgun 資訊:
```env
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=mail.bocyun.com
MAILGUN_FROM=notify@mail.bocyun.com
MAILGUN_FROM_NAME=Bocyun 通知系統
```

**取得 API Key:**
1. 登入 [Mailgun Dashboard](https://app.mailgun.com/)
2. Settings → API Keys → Private API key

## 🚀 使用方式

### 列出可用模板
```bash
npm run send list-templates
```

輸出:
```
📝 可用模板:

  • welcome
```

### 列出收件人群組
```bash
npm run send list-groups
```

輸出:
```
👥 收件人群組:

  • test (1 人)
  • team (2 人)
```

### 發送單封郵件
```bash
npm run send -- send \
  --to user@example.com \
  --template welcome \
  --data '{"name":"Peter","verifyLink":"https://bocyun.com/verify/abc123"}'
```

**Windows PowerShell:**
```powershell
npm run send -- send --to user@example.com --template welcome --data '{\"name\":\"Peter\",\"verifyLink\":\"https://bocyun.com/verify/abc123\"}'
```

**Windows CMD:**
```cmd
npm run send -- send --to user@example.com --template welcome --data "{\"name\":\"Peter\",\"verifyLink\":\"https://bocyun.com/verify/abc123\"}"
```

### 批次發送給群組
```bash
npm run send -- batch \
  --template welcome \
  --group test \
  --data '{"name":"測試用戶","verifyLink":"https://bocyun.com/verify/test"}'
```

## 📝 可用模板

### welcome - 歡迎信

**參數:**
- `name` - 收件人姓名
- `verifyLink` - 驗證連結

**範例:**
```bash
npm run send -- send \
  --to user@example.com \
  --template welcome \
  --data '{"name":"Bocyun","verifyLink":"https://bocyun.com/verify/xyz"}'
```

## 👥 管理收件人群組

編輯 `config/recipients.json`:
```json
{
  "test": [
    "your-email@gmail.com"
  ],
  "team": [
    "member1@example.com",
    "member2@example.com"
  ],
  "vip": [
    "vip1@example.com",
    "vip2@example.com",
    "vip3@example.com"
  ]
}
```

## 🎨 新增自訂模板

### 1. 建立模板檔案

在 `src/templates/` 建立新檔案,例如 `notification.js`:
```javascript
export function notificationTemplate({ title, message, actionLink }) {
  return {
    subject: title,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 40px auto; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>${title}</h2>
          <p>${message}</p>
          ${actionLink ? `<a href="${actionLink}">查看詳情</a>` : ''}
        </div>
      </body>
      </html>
    `,
    text: `${title}\n\n${message}${actionLink ? `\n\n${actionLink}` : ''}`
  };
}
```

### 2. 在 CLI 中註冊模板

編輯 `src/cli.js`,加入:
```javascript
import { notificationTemplate } from "./templates/notification.js";

const templates = {
  welcome: welcomeTemplate,
  notification: notificationTemplate,  // 加這行
};
```

### 3. 使用新模板
```bash
npm run send -- send \
  --to user@example.com \
  --template notification \
  --data '{"title":"系統通知","message":"您有新訊息","actionLink":"https://bocyun.com/messages"}'
```

## 🛠️ 專案結構
```
mailgun-cli/
├── bin/
│   └── mailgun-send.js      # CLI 入口
├── src/
│   ├── mailgun.js           # Mailgun 核心功能
│   ├── cli.js               # CLI 邏輯
│   └── templates/           # 郵件模板
│       └── welcome.js
├── config/
│   └── recipients.json      # 收件人群組
├── .env                     # 環境變數 (不上傳)
├── .gitignore
├── package.json
└── README.md
```

## 📋 指令參考

| 指令 | 說明 |
|------|------|
| `npm run send list-templates` | 列出所有可用模板 |
| `npm run send list-groups` | 列出所有收件人群組 |
| `npm run send -- send -t <email> --template <name> -d <json>` | 發送單封郵件 |
| `npm run send -- batch --template <name> --group <group> -d <json>` | 批次發送 |

## ⚙️ Mailgun 設定

### DNS 記錄

確保你在 DNS 服務商(如 Cloudflare)設定以下記錄:

| Type | Host | Value |
|------|------|-------|
| TXT | mail.bocyun.com | v=spf1 include:mailgun.org ~all |
| TXT | krs._domainkey.mail.bocyun.com | k=rsa; p=MIGf... (Mailgun 提供) |
| MX | mail.bocyun.com | mxa.mailgun.org (Priority: 10) |
| MX | mail.bocyun.com | mxb.mailgun.org (Priority: 10) |
| CNAME | email.mail.bocyun.com | mailgun.org |

## 🐛 常見問題

### 郵件沒收到?

1. 檢查垃圾郵件資料夾
2. 確認 Mailgun DNS 記錄已驗證
3. 查看 Mailgun Dashboard 的 Logs

### API Key 錯誤?

確認 `.env` 中的 `MAILGUN_API_KEY` 是正確的 Private API key

### JSON 格式錯誤?

- Mac/Linux: 使用單引號包 JSON: `'{"name":"value"}'`
- Windows CMD: 使用雙引號並跳脫: `"{\"name\":\"value\"}"`
- Windows PowerShell: 使用單引號並跳脫: `'{\"name\":\"value\"}'`

## 📄 授權

MIT

## 👤 作者

Bocyun Wang

## 🙏 致謝

- [Mailgun](https://www.mailgun.com/) - 郵件服務
- [Commander.js](https://github.com/tj/commander.js) - CLI 框架
- [Chalk](https://github.com/chalk/chalk) - 終端顏色

---

**⭐ 如果這個專案對你有幫助,請給個星星!**
