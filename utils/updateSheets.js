import { config } from "../config/index.js"

import Sheets from "../models/Sheets.js"

export default async function updateSheets() {
  try {
    const a = new Sheets("HPAL")
    const b = new Sheets("HPAM")

    config.sheets = [...(await a.getStock()), ...(await b.getStock())]

    const brands = [...new Set(config.sheets.map((x) => x.brand))]

    console.log("\x1b[32m")
    console.log("# UPDATE STOCK")
    console.log("\x1b[32m")

    brands.forEach((brand) => console.log(`# ${brand} stock total ${config.sheets.filter((x) => x.brand === brand).length} line`))
    console.log("\x1b[0m")
  } catch (error) {
    console.log({ error, source: "updateSheets function" })
  } finally {
    setTimeout(() => updateSheets(), 1 * 60 * 1000)
  }
}
