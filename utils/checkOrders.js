import { config, bot } from "./../config/index.js"

import Shopee from "../models/Shopee.js"

import axios from "axios"

export default async function checkOrders(counter = 0) {
  try {
    const shopee = new Shopee()
    const orders = await shopee.getOrders("perlu_dikirim_perlu_diproses")

    const lists = orders.filter((x) => !config.orders[x.card_header.order_sn])

    for (let i = 0; i < lists.length; i++) {
      const order = lists[i]

      const { card_header, item_info_group, status_info, fulfilment_info, action_info, order_ext_info, package_ext_info } = order
      const { order_sn, buyer_info } = card_header
      const { username } = buyer_info
      const { odp_url_path_query, order_id } = order_ext_info
      const { shipping_address } = package_ext_info

      const { item_info_list, message } = item_info_group
      const { fulfilment_channel_name, masked_channel_name, ship_out_mode, short_code } = fulfilment_info

      config.orders[order_sn] = order

      const reply_markup = { inline_keyboard: [[{ text: order_sn, url: `https://seller.shopee.co.id${odp_url_path_query}` }]] }

      const info = item_info_list.map((info) => {
        const { item_list, item_ext_info } = info

        const arr = item_list.map((list) => {
          const { name, image, description, amount, is_wholesale, inner_item_ext_info } = list
          const { item_id, model_id, is_prescription_item } = inner_item_ext_info

          let product = item_id

          console.log(`\x1b[90m`)
          console.log(`# ${order_sn}\n  ${name}\n  ${description || "NO VARIANT"}`)
          console.log(`\x1b[0m`)

          const type = "photo"
          const url = `https://down-id.img.susercontent.com/file/${image}`

          const filename = image
          const desc = description ? description.replace("Variation:", "Variation :").split(",").join(", ") : ""
          const detail = description ? `${desc} (${amount} pcs)` : `Total : ${amount} pcs`

          const d = desc ? desc.toUpperCase() : ""

          let caption = `# ${fulfilment_channel_name} ${ship_out_mode}\n\n# ${name}\n# ${detail}\n\n# ${order_sn}\n# ${username}`

          if (message) caption += `\n\n<pre>${message}</pre>`

          if (d.includes("HPAL") || d.includes("HPAM") || d.includes("HPC") || d.includes("HPSO") || d.includes("HPU")) caption += "\n\n@pencurilauk @Abductedby_Aliens"

          reply_markup.inline_keyboard.push(
            [
              { text: `VIEW`, url: `https://shopee.co.id/product/24819895/${item_id}` },
              { text: `EDIT ${product}`, url: `https://seller.shopee.co.id/portal/product/${item_id}` },
            ],
            [{ text: `TOOLS ${product}`, url: `https://oyen.online/shopee?id=${item_id}` }]
          )

          return { url, type, caption, media: { source: null, filename } }
        })

        return arr
      })

      if (counter === 0) continue

      const all = info.flat().map(async (x) => {
        try {
          const { data } = await axios({ url: x.url, method: "GET", responseType: "arraybuffer" })
          x.media.source = data
        } catch (error) {
          console.log("\x1b[31m")
          console.log(`# Failed download ${x.filename}`)
          console.log(`  ${x.name}`)
          console.log("\x1b[0m")
        }

        return x
      })

      const media = await Promise.all(all)
      const arr = media.filter((x) => x.media.source)

      const extra = { caption: arr.map((x) => x.caption).join("\n\n\n"), reply_markup, disable_notification: true }

      if (message) extra.parse_mode = "HTML"

      if (arr.length === 1) {
        await bot.telegram.sendPhoto(config.group, arr[0].media, extra)
        continue
      }

      if (arr.length > 1) await bot.telegram.sendMediaGroup(config.group, arr, extra)

      await bot.telegram.sendMessage(config.group, "\n\n" + media.map((x) => x.caption).join("\n\n\n"), extra)
    }
  } catch (error) {
    console.log({ error, source: "checkOrders function" })
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000))
    checkOrders(counter + 1)
  }
}
