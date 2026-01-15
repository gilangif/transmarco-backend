import { config, bot } from "../config/index.js"

import Shopee from "../models/Shopee.js"
import getRandoms from "./getRandom.js"

export default async function boostProducts() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const data = config.sheets.filter((x) => x.brand === "HPAL" && /^\d+$/.test(x.shopee_id))
    const products = Array.from(new Map(data.map((item) => [item.shopee_id, item])).values())

    const shopee = new Shopee()
    const boosts = await shopee.getBoosts()

    if (boosts.code) throw boosts

    if (boosts.length < 5) {
      const random = getRandoms(products, 5 - boosts.length)

      for (const item of random) {
        const { shopee_id, desc, art } = item

        const product_id = parseInt(shopee_id)
        const boosting = await shopee.setBoost(product_id)

        const caption = `# Boost product ${desc} ${art}\n# ${product_id}\n\n# ${boosting.message || boosting.msg || "unknown boosting status"}`

        console.log("\x1b[0m")
        console.log(`# Boost product ${desc} ${art} (${product_id})`)
        console.log(`  ${boosting.message}`)
        console.log("\x1b[0m")

        await bot.telegram.sendMessage(config.group, caption, { disable_notification: true })
      }
    }

    for (let i = 0; i < boosts.length; i++) {
      const boost = boosts[i]

      const name = boost.name ? boost.name : "Unknown Product"
      const category = boost.name ? boost.detail.category_path_name_list.join(" > ") : "Category > Unknown Category"

      const find = config.boosts[boost.boost_id]

      if (!find) {
        config.boosts[boost.boost_id] = {
          ...boost,
          timeout: setTimeout(async () => {
            delete config.boosts[boost.boost_id]

            await bot.telegram.sendMessage(config.group, `# Boost product ${boost.name} timeout`, { disable_notification: true })

            setTimeout(() => boostProducts(), 5000)
          }, parseInt(boost.cool_down_seconds) * 1000),
        }
      }

      console.log("\x1b[36m")
      console.log(`# ${name}\x1b[0m > ${category}`)
      console.log(`  ${boost.boost_id}`, boost.cool_down_seconds)
      console.log("\x1b[0m")
    }

    if (Object.keys(config.boosts).length < 5) setTimeout(() => boostProducts(), 10000)
  } catch (error) {
    console.log({ error, source: "boostProducts function" })
    setTimeout(() => boostProducts(), 5000)
  }
}
