export function welcomeTemplate({ name, verifyLink }) {
  return {
    subject: `歡迎加入,${name}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px 30px;
          }
          .button { 
            background: #667eea;
            color: white !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 歡迎加入!</h1>
          </div>
          <div class="content">
            <h2>嗨 ${name},</h2>
            <p>感謝您的註冊!我們很高興您加入我們的社群。</p>
            <p>請點擊下方按鈕驗證您的信箱:</p>
            <div style="text-align: center;">
              <a href="${verifyLink}" class="button">驗證信箱</a>
            </div>
            <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
              如果按鈕無法點擊,請複製以下連結:<br>
              <a href="${verifyLink}">${verifyLink}</a>
            </p>
          </div>
          <div class="footer">
            <p>如果您沒有註冊,請忽略此信。</p>
            <p>© 2026 Bocyun. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `嗨 ${name},\n\n感謝您的註冊!請點擊以下連結驗證您的信箱:\n${verifyLink}\n\n如果您沒有註冊,請忽略此信。\n\n© 2026 Bocyun`
  }
}