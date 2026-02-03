#!/usr/bin/env node

import dotenv from 'dotenv'
import { createCLI } from '../src/cli.js'

// 載入環境變數
dotenv.config({ quiet: true })

// 檢查必要變數
const requiredEnvVars = ['MAILGUN_API_KEY', 'MAILGUN_DOMAIN', 'MAILGUN_FROM']
const missingVars = requiredEnvVars.filter((v) => !process.env[v])

if (missingVars.length > 0) {
	console.error(`❌ 缺少環境變數: ${missingVars.join(", ")}`)
	console.error('請建立 .env 檔案,參考 .env.example')
  	process.exit(1)
}

const program = createCLI()
program.parse()