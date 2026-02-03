import FormData from "form-data"
import Mailgun from "mailgun.js"

export function createMailgunClient() {
	const mailgun = new Mailgun(FormData)
	return mailgun.client({
		username: 'api',
		key: process.env.MAILGUN_API_KEY
	}) 
}

export async function sendEmail({ to, subject, html, text }) {
	const mg = createMailgunClient()

	const fromName = process.env.MAILGUN_FROM_NAME || 'Mailer'
	const fromEmail = process.env.MAILGUN_FROM

	/*
	<fromEmail> 一定要用設定好的 Custom Domain, 不然假設冒充 notify@gmail.com 寄信的話, 
	收信的伺服器會查詢 gmail.com 的 SPF 記錄
	   → SPF 記錄說:"只有 Google 的伺服器可以代表 @gmail.com 寄信"
	   → 但這封信是從 Mailgun 的伺服器寄的!
	   → 判定:❌ SPF 驗證失敗!
	   → 標記為「可疑」或「垃圾信」
	*/
	try {
		const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
			from: `${fromName} <${fromEmail}>`, 
			to: Array.isArray(to) ? to : [to],
			subject,
			html,
			text,
		})

		return { success: true, data }
	} catch (err) {
		return { success: false, error: err.message }
	}
}