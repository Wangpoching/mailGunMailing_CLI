import { Command } from 'commander'
import chalk from 'chalk'
import { sendEmail } from './mailgun.js'
import { welcomeTemplate } from './templates/welcome.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url) // file:///Users/peter/mailgun-cli/src/cli.js -> /Users/peter/mailgun-cli/src/cli.js
const __dirname = dirname(__filename) // /Users/peter/mailgun-cli/src/cli.js -> /Users/peter/mailgun-cli/src

const templates = {
	welcome: welcomeTemplate,
}

export function createCLI() {
	const program = new Command()

	program
		.name('mailgun-send')
		.description('CLI tool for sending emails via Mailgun')
		.version('1.0.0')

	// 發送單封郵件
	program
		.command('send')
		.description('發送單封郵件')
		.option('-d, --data <json>', '模板資料 (JSON 格式)')
		.requiredOption('-t, --to <email>', '收件人信箱')
		.requiredOption('--template <name>', '模板名稱 (welcome)')
		.action(async (options) => {
			try {
				const template = templates[options.template];
				if (!template) {
					console.error(chalk.red(`❌ 找不到模板: ${options.template}`))
					console.log(chalk.yellow(`可用模板: ${Object.keys(templates).join(", ")}`))
					process.exit(1)
				}

				const data = options.data ? JSON.parse(options.data) : {}
				const { subject, html, text } = template(data)

				console.log(chalk.blue(`📧 正在發送郵件給 ${options.to}...`))
	      
				const result = await sendEmail({
					to: options.to,
					subject,
					html,
					text,
				})

				if (result.success) {
					console.log(chalk.green('✅ 郵件發送成功!'))
					console.log(chalk.gray(`Message ID: ${result.data.id}`))
				} else {
					console.error(chalk.red('❌ 發送失敗:'), result.error)
				}
	    	} catch (error) {
				console.error(chalk.red('❌ 錯誤:'), error.message)
	    	}
	    })

	// 批次發送郵件
	program
		.command('batch')
		.description('批次發送郵件給多個收件人')
		.requiredOption('--template <name>', '模板名稱')
		.requiredOption('--group <name>', '收件人群組 (在 config/recipients.json 中)')
		.option('-d, --data <json>', '模板資料 (JSON 格式)')
		.action(async (options) => {
			try {
				const recipientsPath = join(__dirname, '../config/recipients.json')
				const recipients = JSON.parse(readFileSync(recipientsPath, 'utf8'))

				if (!recipients[options.group]) {
					console.error(chalk.red(`❌ 找不到群組: ${options.group}`))
					console.log(chalk.yellow(`可用群組: ${Object.keys(recipients).join(", ")}`))
					process.exit(1)
				}

				const template = templates[options.template]
				if (!template) {
					console.error(chalk.red(`❌ 找不到模板: ${options.template}`))
					process.exit(1)
				}

				const emails = recipients[options.group]
				const baseData = options.data ? JSON.parse(options.data) : {}

				console.log(chalk.blue(`📧 準備發送給 ${emails.length} 位收件人...`))

				let successCount = 0
				let failCount = 0

				for (const email of emails) {
					const data = { ...baseData, email }
					const { subject, html, text } = template(data)

					const result = await sendEmail({
						to: email,
						subject,
						html,
						text,
					})

					if (result.success) {
						console.log(chalk.green(`✅ ${email}`))
						successCount++
					} else {
						console.log(chalk.red(`❌ ${email}: ${result.error}`))
						failCount++
					}

					// 等等再發
					await new Promise((resolve) => setTimeout(resolve, 1000))
				}

				console.log(chalk.bold(`\n📊 發送完成: ${successCount} 成功, ${failCount} 失敗`));
			} catch (error) {
				console.error(chalk.red('❌ 錯誤:'), error.message)	
			}
		})

	// 列出可用模板
	program
		.command('list-templates')
		.description('列出所有可用模板')
		.action(() => {
			console.log(chalk.bold('📝 可用模板:\n'))
			Object.keys(templates).forEach((name) => {
				console.log(chalk.cyan(`  • ${name}`))
			})
		})

	// 列出收件人群組
	program
		.command('list-groups')
		.description('列出收件人群組')
		.action(() => {
			try {
				const recipientsPath = join(__dirname, '../config/recipients.json')
				const recipients = JSON.parse(readFileSync(recipientsPath, 'utf8'))

				console.log(chalk.bold('👥 收件人群組:\n'))
				Object.entries(recipients).forEach(([group, emails]) => {
					console.log(chalk.cyan(`  • ${group}`) + chalk.gray(` (${emails.length} 人)`))
				})
			} catch (error) {
				console.error(chalk.red('❌ 錯誤:'), error.message)
			}
		})

	return program
}