import { config } from "./../config/index.js"

import Sheets from "../models/Sheets.js"

class SheetController {
  static async getStock(req, res, next) {
    try {
      const { brand } = req.user || {}

      const stocks = config.stocks.filter((x) => x.brand === brand)

      res.json(stocks)
    } catch (error) {
      next(error)
    }
  }

  static async getEcomm(req, res, next) {
    try {
      const { brand } = req.user || {}

      const sheets = new Sheets(brand)
      const ecomm = await sheets.getEcomm()

      res.json(ecomm)
    } catch (error) {
      next(error)
    }
  }

  static async getStockNow(req, res, next) {
    try {
      const { brand } = req.user || {}

      const sheets = new Sheets(brand)
      const stocks = await sheets.getStock()

      res.json(stocks)
    } catch (error) {
      next(error)
    }
  }

  static async searchStock(req, res, next) {
    try {
      const { item, artikel, barcode, shopee_id, search } = req.body || {}
      const { brand } = req.user || {}

      if (search) {
        const stocks = config.stocks.filter((x) => x.brand === brand && JSON.stringify(x).includes(search.toUpperCase())).slice(0, 5)
        return res.json(stocks)
      }

      if (shopee_id) {
        const stocks = config.stocks.filter((x) => x.brand === brand && x.shopee_id === shopee_id)
        return res.json(stocks)
      }

      if (item) {
        const stocks = config.stocks.filter((x) => x.brand === brand && x.item === item)
        return res.json(stocks)
      }

      if (artikel) {
        const stocks = config.stocks.filter((x) => x.brand === brand && x.artikel === artikel)
        return res.json(stocks)
      }

      if (barcode) {
        const stocks = config.stocks.find((x) => x.brand === brand && x.barcode === barcode)
        return res.json(stocks)
      }

      throw { status: 400, message: "item, artikel or barcode is not provided" }
    } catch (error) {
      next(error)
    }
  }

  static async addEcomm(req, res, next) {
    try {
      const {
        order_sn,
        barcode,
        qty = 0,
        sku_variant = "",
        product_name = "",
        variant_name = "",
        order_price = "",
        status_info = "",
        item_id = "",
        model_id = "",
        shipping = "",
        status = "",
        note = "",
      } = req.body

      const { brand } = req.user || {}

      if (!order_sn) throw { status: 400, message: "order_sn is not provided" }
      if (!barcode) throw { status: 400, message: "barcode is not provided" }
      if (qty < 1) throw { status: 400, message: "qty must be greater than zero" }

      const pad = (n) => String(n).padStart(2, "0")

      const message = []

      const d = new Date()
      const timestamp = `${d.getFullYear()},${pad(d.getMonth() + 1)},${pad(d.getDate())},${pad(d.getHours())}:${pad(d.getMinutes())}`

      const sheets = new Sheets(brand)
      const ecomm = await sheets.getEcomm()

      const item = config.stocks.find((x) => x.barcode === barcode)
      const filter = ecomm.filter((x) => x.order_sn === order_sn)

      const price = order_price * qty

      if (!item) throw { status: 400, message: `barcode ${barcode} not exists` }
      if (filter.length > 0) filter.forEach((x) => message.push(`barcode ${x.order_sn} sudah digunakan untuk ${x.barcode}`))

      const add = await sheets.append(order_sn, barcode, qty, status, sku_variant, product_name, variant_name, price, status_info, item_id, model_id, shipping, timestamp, note)

      res.json({ ...add, message, success: true })
    } catch (error) {
      next(error)
    }
  }
}

export default SheetController
