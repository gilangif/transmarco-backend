import { Telegraf } from "telegraf"
import { exec } from "child_process"

import fs from "fs"

export const config = { stocks: [], pesanan: [], orders: {}, boosts: {}, group: "-1003576780077" }

export const JWT_SECRET = "juwanto"

export const bot = new Telegraf("8519274635:AAGD_IDTVUAUTcR0zpcw6a94c6jGd2Kod8U")

// const profile = await bot.telegram.getMe()

// console.log(`# Bot ${profile.first_name} (@${profile.username}) connected`)

// bot.on("document", async (ctx) => {
//   const { update, telegram, botInfo } = ctx
//   const { update_id, message } = update || {}
//   const { message_id, from, chat, date, text, document } = message || {}
//   const { id, is_bot, first_name, last_name, username, language_code } = from || {}
//   const { file_name, mime_type, file_id, file_unique_id, file_size } = document || {}

//   if (config.messageid.includes(message_id)) return
//   config.messageid.unshift(message_id)

//   if (mime_type.split("/")[1] !== "json") return

//   await ctx.replyWithChatAction("upload_document")

//   const { href, origin, protocol, host, hostname, port, pathname, search } = await ctx.telegram.getFileLink(file_id)
//   const { data } = await axios({ method: "GET", url: href, responseType: "arraybuffer" })

//   const { url, cookies } = JSON.parse(data.toString("utf-8"))

//   if (!url || (url && !url.includes("shopee.co.id"))) return await ctx.reply("# Sepertinya cookies shopee file kamu tidak valid")

//   fs.writeFileSync("cookies.json", data)

//   await ctx.reply("# Data cookies shopee di update, program akan restart ya..")
//   await ctx.reply("# Bapak akan bangkit lagi nanti")

//   await new Promise((resolve) => setTimeout(resolve, 2000))

//   exec(`pm2 flush; pm2 restart ${process.env.name}`, { timeout: 2 * 60000 })
// })

// bot.launch()
