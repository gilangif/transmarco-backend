import { config } from "../config/index.js"

import Sheets from "../models/Sheets.js"

export default async function updateSheets() {
  try {
    const hpal = new Sheets("HPAL")
    const hpal_data = await hpal.getStock()

    const hpam = new Sheets("HPAM")
    const hpam_data = await hpam.getStock()

    // const hpbl = new Sheets("HPBL")
    // const hpbl_data = await hpbl.getStock()

    // const hpbm = new Sheets("HPBM")
    // const hpbm_data = await hpbm.getStock()

    const hpm = new Sheets("HPM")
    const hpm_data = await hpm.getStock()

    const hpl = new Sheets("HPL")
    const hpl_data = await hpl.getStock()

    const hpso = new Sheets("HPSO")
    const hpso_data = await hpso.getStock()

    const obam = new Sheets("OBAM")
    const obam_data = await obam.getStock()

    // const obbl = new Sheets("OBBL")
    // const obbl_data = await obbl.getStock()

    const obl = new Sheets("OBL")
    const obl_data = await obl.getStock()

    const obm = new Sheets("OBM")
    const obm_data = await obm.getStock()

    const obbm = new Sheets("OBBM")
    const obbm_data = await obbm.getStock()

    const plm = new Sheets("PLM")
    const plm_data = await plm.getStock()

    // const pll = new Sheets("PLL")
    // const pll_data = await pll.getStock()

    const cat = new Sheets("CAT")
    const cat_data = await cat.getStock()

    config.stocks = [
      ...hpal_data,
      ...hpam_data,
      // ...hpbl_data,
      // ...hpbm_data,
      ...hpl_data,
      ...hpm_data,
      ...hpso_data,
      ...obam_data,
      // ...obbl_data,
      ...obl_data,
      ...obm_data,
      ...obbm_data,
      ...plm_data,
      // ...pll_data,
      ...cat_data,
    ]

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
