import { config } from "../config/index.js"

import Sheets from "../models/Sheets.js"

export default async function updateSheets() {
  try {
    const a = new Sheets("HPAL")
    const b = await a.getStock()

    const c = new Sheets("HPAM")
    const d = await c.getStock()

    const e = new Sheets("HPSL")
    const f = await e.getStock()

    config.stocks = [...b, ...d, ...f]

    const brands = [...new Set(config.stocks.map((x) => x.brand))]

    console.log("\x1b[32m")
    console.log("# UPDATE STOCK")
    console.log("\x1b[32m")

    brands.forEach((brand) => console.log(`# ${brand} stock total ${config.stocks.filter((x) => x.brand === brand).length} line`))
    console.log("\x1b[0m")
  } catch (error) {
    console.log({ error, source: "updateSheets function" })
  } finally {
    setTimeout(() => updateSheets(), 1 * 30 * 1000)
  }
}
